package org.carlessos.erpiotta.data

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.carlessos.erpiotta.BuildConfig
import java.net.HttpURLConnection
import java.net.URL
import java.time.Instant
import java.time.LocalDate

@Serializable
private data class LocalItemOverride(
    val archived: Boolean? = null,
    val snoozedUntil: String? = null,
    val note: String? = null,
)

@Serializable
private data class MobileFeedResponse(
    val ok: Boolean = false,
    val items: List<RawFeedItem> = emptyList(),
    val kid_logs: List<KidLogEntry> = emptyList(),
)

class PiotaRepository(private val context: Context) {
    private val prefs = context.getSharedPreferences("er_piotta_prefs_v1", Context.MODE_PRIVATE)
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        coerceInputValues = true
    }

    fun loadOfflineFeed(): List<PiotaItem> {
        val rawStr = prefs.getString("cached_feed_json", null)
            ?: context.assets.open("piota_feed.json").bufferedReader().use { it.readText() }
        return parseAndFilter(rawStr)
    }

    fun parseAndFilter(rawJson: String): List<PiotaItem> {
        val rawItems = try {
            json.decodeFromString<List<RawFeedItem>>(rawJson)
        } catch (_: Exception) {
            emptyList()
        }
        val overrides = loadOverrides()
        val todayIso = LocalDate.now().toString()
        val seen = mutableSetOf<String>()

        return rawItems
            .asSequence()
            .filter { !AgentsPolicyFilter.shouldDropAsNoise(it) }
            .map { AgentsPolicyFilter.toPiotaItem(it, todayIso) }
            .map { item ->
                val ov = overrides[item.id]
                if (ov != null) {
                    item.copy(
                        isArchived = ov.archived ?: item.isArchived,
                        snoozedUntil = ov.snoozedUntil ?: item.snoozedUntil,
                        note = ov.note ?: item.note,
                    )
                } else item
            }
            .filter { item ->
                val key = "${item.primaryDate}|${item.kidCode}|${item.cleanTitle.lowercase()}"
                seen.add(key)
            }
            .sortedWith(
                compareBy<PiotaItem>(
                    { if (it.type == "event" && it.primaryDate >= todayIso) 0 else if (it.isActionRequired) 1 else 2 },
                    { if (it.type == "event" && it.primaryDate >= todayIso) it.primaryDate else "9999-99-99" },
                ).thenByDescending { it.primaryDate }
            )
            .toList()
    }

    fun extractPhotoAlbums(items: List<PiotaItem>): List<PhotoAlbumItem> {
        val seen = mutableSetOf<String>()
        val result = mutableListOf<PhotoAlbumItem>()
        for (it in items) {
            for (u in it.photoUrls) {
                if (!seen.add(u)) continue
                val provider = if (u.contains("drive.google.com")) "Google Drive" else "Google Photos"
                val tl = "${it.cleanTitle} ${it.body}".lowercase()
                val act = when {
                    tl.contains("sport") || tl.contains("dodgeball") -> "Sport"
                    tl.contains("art") -> "Arte"
                    tl.contains("diwali") -> "Feste"
                    tl.contains("tawanga") || tl.contains("christmas") -> "Natale"
                    else -> "Classe"
                }
                result.add(
                    PhotoAlbumItem(
                        url = u,
                        provider = provider,
                        kidCode = it.kidCode,
                        activity = act,
                        title = it.cleanTitle,
                        dateIso = it.primaryDate,
                        emailId = it.id,
                    )
                )
            }
        }
        return result.sortedByDescending { it.dateIso }
    }

    fun loadLocalLogs(): List<KidLogEntry> {
        val str = prefs.getString("kid_logs_json", null)
        if (str.isNullOrBlank()) return PreviewFixtures.sampleLogs
        return try {
            json.decodeFromString<List<KidLogEntry>>(str)
        } catch (_: Exception) {
            PreviewFixtures.sampleLogs
        }
    }

    fun saveLocalLog(entry: KidLogEntry): List<KidLogEntry> {
        val cur = loadLocalLogs().toMutableList()
        cur.add(0, entry)
        prefs.edit().putString("kid_logs_json", json.encodeToString(cur)).apply()
        return cur
    }

    fun updateItemOverride(itemId: String, archived: Boolean? = null, snoozedUntil: String? = null, note: String? = null) {
        val map = loadOverrides().toMutableMap()
        val prev = map[itemId] ?: LocalItemOverride()
        map[itemId] = prev.copy(
            archived = archived ?: prev.archived,
            snoozedUntil = snoozedUntil ?: prev.snoozedUntil,
            note = note ?: prev.note,
        )
        prefs.edit().putString("item_overrides_json", json.encodeToString(map)).apply()
    }

    private fun loadOverrides(): Map<String, LocalItemOverride> {
        val str = prefs.getString("item_overrides_json", null) ?: return emptyMap()
        return try {
            json.decodeFromString(str)
        } catch (_: Exception) {
            emptyMap()
        }
    }

    suspend fun syncFromServer(): Pair<List<PiotaItem>, List<KidLogEntry>>? = withContext(Dispatchers.IO) {
        try {
            val conn = (URL("${BuildConfig.API_BASE_URL}/api/mobile-feed").openConnection() as HttpURLConnection).apply {
                connectTimeout = 3500
                readTimeout = 4500
                requestMethod = "GET"
            }
            if (conn.responseCode == 200) {
                val txt = conn.inputStream.bufferedReader().use { it.readText() }
                val resp = json.decodeFromString<MobileFeedResponse>(txt)
                if (resp.ok && resp.items.isNotEmpty()) {
                    val encodedItems = json.encodeToString(resp.items)
                    prefs.edit().putString("cached_feed_json", encodedItems).apply()
                    if (resp.kid_logs.isNotEmpty()) {
                        prefs.edit().putString("kid_logs_json", json.encodeToString(resp.kid_logs)).apply()
                    }
                    return@withContext parseAndFilter(encodedItems) to (if (resp.kid_logs.isNotEmpty()) resp.kid_logs else loadLocalLogs())
                }
            }
            null
        } catch (_: Exception) {
            null
        }
    }

    suspend fun pushLogToServer(entry: KidLogEntry, syncSeptober: Boolean): Boolean = withContext(Dispatchers.IO) {
        try {
            val conn = (URL("${BuildConfig.API_BASE_URL}/api/piotta-log").openConnection() as HttpURLConnection).apply {
                connectTimeout = 3000
                readTimeout = 5000
                requestMethod = "POST"
                doOutput = true
                setRequestProperty("Content-Type", "application/json")
            }
            val body = """{"kid":${json.encodeToString(entry.kid)},"topic":${json.encodeToString(entry.topic)},"subtopic":${json.encodeToString(entry.subtopic)},"text":${json.encodeToString(entry.text)},"score":${json.encodeToString(entry.score)},"author":${json.encodeToString(entry.author)},"item_id":${json.encodeToString(entry.itemId)},"sync_septober":$syncSeptober}"""
            conn.outputStream.use { it.write(body.toByteArray(Charsets.UTF_8)) }
            conn.responseCode in 200..299
        } catch (_: Exception) {
            false
        }
    }

    suspend fun pushTicketPatchToServer(itemId: String, archived: Boolean? = null, snoozedUntil: String? = null, note: String? = null) =
        withContext(Dispatchers.IO) {
            try {
                val conn = (URL("${BuildConfig.API_BASE_URL}/api/ticket").openConnection() as HttpURLConnection).apply {
                    connectTimeout = 2500
                    readTimeout = 3500
                    requestMethod = "POST"
                    doOutput = true
                    setRequestProperty("Content-Type", "application/json")
                }
                val fields = mutableListOf("\"id\":${json.encodeToString(itemId)}")
                if (archived != null) fields.add("\"archived\":$archived")
                if (snoozedUntil != null) fields.add("\"snoozed_until\":${json.encodeToString(snoozedUntil)}")
                if (note != null) fields.add("\"note\":${json.encodeToString(note)}")
                conn.outputStream.use { it.write("{${fields.joinToString(",")}}".toByteArray(Charsets.UTF_8)) }
                conn.responseCode
            } catch (_: Exception) {
                // Offline-resilient: local SharedPreferences already saved
            }
        }

    fun newLogEntry(
        kid: String,
        topic: String,
        subtopic: String,
        text: String,
        score: String,
        author: String = "Riccardo",
        syncSeptober: Boolean = false,
    ): KidLogEntry = KidLogEntry(
        id = "log_${System.currentTimeMillis()}",
        timestamp = Instant.now().toString(),
        kid = kid,
        topic = topic,
        subtopic = subtopic.trim(),
        text = text.trim(),
        score = score.trim(),
        author = author,
        septoberLink = if (syncSeptober) "pending://septober" else "",
    )
}
