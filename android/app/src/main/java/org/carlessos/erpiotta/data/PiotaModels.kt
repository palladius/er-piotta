package org.carlessos.erpiotta.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

enum class ProvenanceKind(val shortTag: String, val label: String) {
    EMAIL("EMAIL", "Email · Gmail"),
    GCAL("GCAL", "Calendario Scuola"),
    WHATSAPP("WHATSAPP", "WhatsApp Genitori"),
    AI_AUTO("AI", "AI · Piotta AI GCal"),
    PIOTA_LEGACY("PIOTA", "Archivio Piota"),
}

enum class KidFilter(val code: String, val label: String) {
    ALL("all", "Tutti"),
    ALE("Ale", "Ale · P3"),
    SEB("Seb", "Seby · P1"),
}

@Serializable
data class RawTicket(
    val required: Boolean = false,
    val owner: String = "unassigned",
    @SerialName("due_date") val dueDate: String? = null,
    val status: String = "open",
    val note: String = "",
)

@Serializable
data class RawConsumption(
    @SerialName("read_by_riccardo") val readByRiccardo: Boolean = false,
    @SerialName("read_by_kate") val readByKate: Boolean = false,
    val archived: Boolean = false,
    @SerialName("snoozed_until") val snoozedUntil: String = "",
)

@Serializable
data class RawFeedItem(
    val id: String = "",
    val type: String = "alert",
    val source: String = "",
    val layer: String = "",
    val title: String = "",
    val body: String = "",
    val datestart: String? = null,
    @SerialName("event_date") val eventDate: String? = null,
    @SerialName("created_date") val createdDate: String? = null,
    @SerialName("created_at") val createdAt: String? = null,
    @SerialName("auto_archive_at") val autoArchiveAt: String? = null,
    @SerialName("source_url") val sourceUrl: String? = null,
    @SerialName("source_email_id") val sourceEmailId: String? = null,
    @SerialName("sender_name") val senderName: String? = null,
    @SerialName("sender_email") val senderEmail: String? = null,
    @SerialName("kid_code") val kidCode: String? = null,
    @SerialName("target_kids") val targetKids: List<String> = emptyList(),
    val nature: String = "info",
    val ticket: RawTicket? = null,
    val consumption: RawConsumption? = null,
)

@Serializable
data class KidLogEntry(
    val id: String,
    val timestamp: String,
    val kid: String,          // "Ale", "Seby", "A+S"
    val topic: String,        // "Piano", "Math", "FR", "DE", "EN", "Vita", "Altro"
    val subtopic: String = "",
    val text: String,
    val score: String = "",   // Optional e.g. "70/100"
    val itemId: String = "",
    val author: String = "Riccardo",
    val septoberLink: String = "",
)

data class PhotoAlbumItem(
    val url: String,
    val provider: String,
    val kidCode: String,
    val activity: String,
    val title: String,
    val dateIso: String,
    val emailId: String,
)

data class PiotaItem(
    val id: String,
    val type: String,
    val title: String,
    val cleanTitle: String,
    val body: String,
    val snippet: String,
    val kidCode: String,          // "Ale", "Seb", "A+S"
    val primaryDate: String,      // YYYY-MM-DD
    val timestampYmdHm: String,   // YYYYMMDD HH:MM or YYYYMMDD
    val provenance: ProvenanceKind,
    val provenanceDetail: String,
    val fromLine: String,
    val sourceUrl: String,
    val isActionRequired: Boolean,
    val isAiLayer: Boolean,
    val isArchived: Boolean,
    val snoozedUntil: String,
    val note: String,
    val photoUrls: List<String>,
)

object AgentsPolicyFilter {
    private val pureNoise = listOf(
        "staff goodbyes",
        "staff welcomes",
        "departing colleagues",
        "new colleagues",
        "swiss holiday",
        "festività svizzera",
        "happy holidays",
        "küsnacht",
        "kusnacht",
        "school bus",
        "bus service",
    )

    private val xmasCardsTerms = listOf("christmas card", "tawang", "tawanga")
    private val paymentActionTerms = listOf("pay", "payment", "chf", "fr.", "$", "order deadline", "ordering link", "invoice", "bill")

    /** Applies AGENTS.md ("Riccardo Filter") to decide if an item should be hidden as noise. */
    fun shouldDropAsNoise(raw: RawFeedItem): Boolean {
        val titleL = raw.title.lowercase()
        val text = "${raw.title} ${raw.body}".lowercase()

        // Drop legacy Piota SQLite events (Google Classroom event_gcal_ & event_ai_ are canonical)
        if (raw.type == "event" && raw.id.startsWith("event_") &&
            !raw.id.startsWith("event_gcal_") && !raw.id.startsWith("event_ai_")
        ) return true

        // Drop duplicate Fwd / automated digest emails
        if (raw.id.startsWith("alert_gmail_") && (
                raw.title.startsWith("Fwd: [") ||
                    raw.title.contains("Briefing Settimana") ||
                    raw.title.contains("Piota AI Agent: Weekly Digest")
                )
        ) return true

        // Drop other parents' booked PTC slots
        if (titleL.contains("ptc") && titleL.contains("(") && titleL.contains(")")) {
            val isOurs = listOf("carlesso", "riccardo", "kate carlesso", "knight", "palladius").any { text.contains(it) }
            if (!isOurs) return true
        }

        // Drop pure noise (Staff Goodbyes/Welcomes, generic Swiss holidays, school bus)
        if (pureNoise.any { text.contains(it) }) return true

        // Drop Christmas Cards / Tawang'a unless explicit payment / ordering action
        if (xmasCardsTerms.any { text.contains(it) } && paymentActionTerms.none { text.contains(it) }) {
            return true
        }

        // Drop duplicate synthetic piano event_gcal_ when event_ai_zaino_piano exists
        if (raw.id.startsWith("event_gcal_") && raw.id.contains("piano")) return true

        return false
    }

    fun formatYmdHmZurich(rawTs: String, fallbackDate: String): String {
        val trimmed = rawTs.trim()
        if (trimmed.matches(Regex("""\d{4}-\d{2}-\d{2}"""))) {
            return trimmed.replace("-", "")
        }
        return try {
            val zdt = try {
                Instant.parse(trimmed).atZone(ZoneId.of("Europe/Zurich"))
            } catch (_: Exception) {
                ZonedDateTime.parse(trimmed).withZoneSameInstant(ZoneId.of("Europe/Zurich"))
            }
            zdt.format(DateTimeFormatter.ofPattern("yyyyMMdd HH:mm"))
        } catch (_: Exception) {
            fallbackDate.take(10).replace("-", "").ifBlank { "—" }
        }
    }

    fun toPiotaItem(raw: RawFeedItem, todayIso: String): PiotaItem {
        val cleanTitle = raw.title
            .removePrefix("[P1 Seby] ")
            .removePrefix("[P3 Ale] ")
            .removePrefix("[P1] ")
            .removePrefix("[P3] ")
            .removePrefix("🤖 [Ale] ")
            .removePrefix("🤖 [Seby] ")
            .removePrefix("🤖 [A+S] ")
            .trim()

        val kidCode = when {
            raw.kidCode == "Ale" -> "Ale"
            raw.kidCode == "Seb" -> "Seb"
            raw.title.contains("P3", ignoreCase = true) || raw.targetKids.any { it.equals("Ale", true) } -> "Ale"
            raw.title.contains("P1", ignoreCase = true) || raw.targetKids.any { it.equals("Seby", true) } -> "Seb"
            else -> "A+S"
        }

        val primaryDate = (if (raw.type == "event") {
            raw.eventDate ?: raw.datestart ?: raw.createdDate
        } else {
            raw.createdDate ?: raw.createdAt ?: raw.eventDate
        } ?: todayIso).take(10)

        val isWa = raw.id.contains("_wa_") || raw.body.contains("WHATSAPP", ignoreCase = true)
        val isAi = raw.id.startsWith("event_ai_") || raw.layer == "ai" || raw.source == "piotta_ai_gcal"
        val isGmail = raw.id.startsWith("alert_gmail_") || (raw.sourceUrl?.contains("mail.google.com") == true)

        val provenance = when {
            isWa -> ProvenanceKind.WHATSAPP
            isAi -> ProvenanceKind.AI_AUTO
            isGmail -> ProvenanceKind.EMAIL
            raw.type == "event" -> ProvenanceKind.GCAL
            else -> ProvenanceKind.PIOTA_LEGACY
        }

        val fromRegex = Regex("""^\*\*From:\*\*\s*(.+)$""", RegexOption.MULTILINE)
        val fromHeader = fromRegex.find(raw.body)?.groupValues?.getOrNull(1)?.trim()
        val fromLine = when (provenance) {
            ProvenanceKind.EMAIL -> fromHeader ?: listOfNotNull(raw.senderName, raw.senderEmail?.let { "<$it>" }).joinToString(" ").ifBlank { "Tandem IMS" }
            ProvenanceKind.WHATSAPP -> "Priyanka · Tandem Primary 1"
            ProvenanceKind.AI_AUTO -> "Er Piotta AI · Piotta AI GCal"
            ProvenanceKind.GCAL -> if (kidCode == "Ale") "Google Calendar Primary 3 (Ale)" else "Google Calendar Primary 1 (Seby)"
            ProvenanceKind.PIOTA_LEGACY -> raw.senderName ?: "Tandem IMS (Archivio Piota)"
        }

        val provDetail = when (provenance) {
            ProvenanceKind.EMAIL -> "Email reale su tandemims30@gmail.com"
            ProvenanceKind.WHATSAPP -> "Gruppo genitori Tandem (allowlist read-only)"
            ProvenanceKind.AI_AUTO -> "Promemoria generato dall'AI su Piotta AI GCal"
            ProvenanceKind.GCAL -> "Evento ufficiale dal Google Classroom di classe"
            ProvenanceKind.PIOTA_LEGACY -> "Comunicazione dalla vecchia app Piota (dismessa)"
        }

        val cleanBody = raw.body
            .replace(Regex("""^\*\*From:\*\*.*\n?""", RegexOption.MULTILINE), "")
            .replace(Regex("""^\*\*Date:\*\*.*\n?""", RegexOption.MULTILINE), "")
            .replace("[[AUTO_TRANSLATED_DE_EN_V1.2.3]]", "[Auto-translated DE -> EN · Er Piotta]")
            .trim()

        val snippet = cleanBody
            .replace(Regex("""\[([^\]]+)\]\(https?://[^\s)]+\)"""), "$1")
            .replace(Regex("""\s+"""), " ")
            .take(120)

        val photoRegex = Regex("""https?://(?:photos\.app\.goo\.gl|photos\.google\.com|drive\.google\.com/drive/folders)/[^\s)\]"'*>]+""")
        val photoUrls = photoRegex.findAll(raw.body).map { it.value.trimEnd('.', ',', ';', '*') }.distinct().toList()

        val autoArch = raw.autoArchiveAt?.take(10)
        val isAutoExpired = autoArch != null && autoArch < todayIso && !isAi && !isWa
        val isArchived = (raw.consumption?.archived == true) || isAutoExpired

        val isAction = raw.nature == "action_required" || (raw.ticket?.required == true) ||
            listOf("test", "lzk", "sats", "homework", "hw:", "schuhgrösse", "silvesterlauf", "ptc", "zaino", "ripasso")
                .any { cleanTitle.lowercase().contains(it) }

        return PiotaItem(
            id = raw.id,
            type = raw.type,
            title = raw.title,
            cleanTitle = cleanTitle,
            body = cleanBody,
            snippet = snippet,
            kidCode = kidCode,
            primaryDate = primaryDate,
            timestampYmdHm = formatYmdHmZurich(raw.createdAt ?: primaryDate, primaryDate),
            provenance = provenance,
            provenanceDetail = provDetail,
            fromLine = fromLine,
            sourceUrl = raw.sourceUrl ?: "",
            isActionRequired = isAction,
            isAiLayer = isAi,
            isArchived = isArchived,
            snoozedUntil = raw.consumption?.snoozedUntil ?: "",
            note = raw.ticket?.note ?: "",
            photoUrls = photoUrls,
        )
    }
}

object PreviewFixtures {
    val sampleItems: List<PiotaItem> = listOf(
        PiotaItem(
            id = "event_gcal_p3_20261130_sats",
            type = "event",
            title = "[P3 Ale] SATS Grammar & Punctuation",
            cleanTitle = "SATS Grammar & Punctuation",
            body = "Primary 3 Grammar, Punctuation & Spelling SATs assessment in class with Miss Jessica Penrose.",
            snippet = "Primary 3 Grammar, Punctuation & Spelling SATs assessment in class with Miss Jessica Penrose.",
            kidCode = "Ale",
            primaryDate = "2026-11-30",
            timestampYmdHm = "20261130",
            provenance = ProvenanceKind.GCAL,
            provenanceDetail = "Evento ufficiale dal Google Classroom di classe",
            fromLine = "Google Calendar Primary 3 (Ale)",
            sourceUrl = "https://calendar.google.com/calendar/u/0/r",
            isActionRequired = true,
            isAiLayer = false,
            isArchived = false,
            snoozedUntil = "",
            note = "Ripassato punteggiatura domenica sera",
            photoUrls = emptyList(),
        ),
        PiotaItem(
            id = "alert_gmail_1a1f3885fe_schuhgroesse",
            type = "alert",
            title = "Schuhgrösse für Schlittschuhfahren",
            cleanTitle = "Schuhgrösse für Schlittschuhfahren",
            body = "[Auto-translated DE -> EN · Er Piotta]\nDear Parents,\nWe would like to go ice skating with the class and need your children's shoe size.\n---\nLiebe Eltern, wir würden gerne mit der Klasse Schlittschuhfahren gehen und brauchen dafür die Schuhgrösse.",
            snippet = "We would like to go ice skating with the class and need your children's shoe size.",
            kidCode = "Ale",
            primaryDate = "2026-11-19",
            timestampYmdHm = "20261119 12:18",
            provenance = ProvenanceKind.EMAIL,
            provenanceDetail = "Email reale su tandemims30@gmail.com",
            fromLine = "Marvin Biehl <mbiehl@tandem-ims.ch>",
            sourceUrl = "https://mail.google.com/mail/u/0/#inbox/1a1f3885fe",
            isActionRequired = true,
            isAiLayer = false,
            isArchived = false,
            snoozedUntil = "",
            note = "",
            photoUrls = emptyList(),
        ),
        PiotaItem(
            id = "event_ai_wa_20261206_kunsthaus",
            type = "event",
            title = "🎨 [A+S] Kunsthaus: Der Riesen-Grittibänz (da Priyanka · Tandem Primary 1)",
            cleanTitle = "Kunsthaus: Der Riesen-Grittibänz (da Priyanka · Tandem P1)",
            body = "Segnalato da Priyanka su Tandem Primary 1:\n\"For those here Dec 6, then Kunsthaus is having a lovely event for kids!\"\nhttps://www.kunsthaus.ch/besuch-planen/programm/der-riesen-grittibanz-im-kunsthaus/",
            snippet = "For those here Dec 6, Kunsthaus is having a lovely event for kids!",
            kidCode = "A+S",
            primaryDate = "2026-12-06",
            timestampYmdHm = "20261206",
            provenance = ProvenanceKind.WHATSAPP,
            provenanceDetail = "Gruppo genitori Tandem (allowlist read-only)",
            fromLine = "Priyanka · Tandem Primary 1",
            sourceUrl = "https://www.kunsthaus.ch/besuch-planen/programm/der-riesen-grittibanz-im-kunsthaus/",
            isActionRequired = false,
            isAiLayer = true,
            isArchived = false,
            snoozedUntil = "",
            note = "",
            photoUrls = emptyList(),
        ),
        PiotaItem(
            id = "event_ai_zaino_fr_seby_20261203",
            type = "event",
            title = "🤖 [Seby] Zaino: Cartellina trasparente Francese + Libro",
            cleanTitle = "Zaino: Cartellina Francese + Libro",
            body = "Portare la cartellina trasparente di Francese con il libro ogni giovedì (Mme Amaia Conde · Unit 2).",
            snippet = "Portare la cartellina trasparente di Francese ogni giovedì (Mme Conde).",
            kidCode = "Seb",
            primaryDate = "2026-12-03",
            timestampYmdHm = "20261203",
            provenance = ProvenanceKind.AI_AUTO,
            provenanceDetail = "Promemoria generato dall'AI su Piotta AI GCal",
            fromLine = "Er Piotta AI · Piotta AI GCal",
            sourceUrl = "",
            isActionRequired = true,
            isAiLayer = true,
            isArchived = false,
            snoozedUntil = "",
            note = "",
            photoUrls = emptyList(),
        ),
        PiotaItem(
            id = "event_gcal_p1_20261201_deutsch",
            type = "event",
            title = "[P1 Seby] Homework: Deutsch",
            cleanTitle = "Homework: Deutsch (Schreibheft)",
            body = "Completare le pagine assegnate sullo Schreibheft di tedesco (Frau Faux).",
            snippet = "Completare le pagine assegnate sullo Schreibheft di tedesco (Frau Faux).",
            kidCode = "Seb",
            primaryDate = "2026-12-01",
            timestampYmdHm = "20261201",
            provenance = ProvenanceKind.GCAL,
            provenanceDetail = "Evento ufficiale dal Google Classroom di classe",
            fromLine = "Google Calendar Primary 1 (Seby)",
            sourceUrl = "",
            isActionRequired = true,
            isAiLayer = false,
            isArchived = false,
            snoozedUntil = "",
            note = "",
            photoUrls = emptyList(),
        ),
        PiotaItem(
            id = "alert_gmail_1a1e8bbf95_photos",
            type = "alert",
            title = "Photos: Sports Lesson",
            cleanTitle = "Photos: Sports Lesson (Dodgeball)",
            body = "Dear Parents, please see photos from our sports lesson: https://photos.app.goo.gl/DQzkTiNsJtEybgpb8",
            snippet = "PR1 played dodgeball in gym class — Google Photos album linked.",
            kidCode = "Seb",
            primaryDate = "2026-11-17",
            timestampYmdHm = "20261117 09:59",
            provenance = ProvenanceKind.EMAIL,
            provenanceDetail = "Email reale su tandemims30@gmail.com",
            fromLine = "Gaby Rayment <grayment@tandem-ims.ch>",
            sourceUrl = "https://mail.google.com/mail/u/0/#inbox/1a1e8bbf95",
            isActionRequired = false,
            isAiLayer = false,
            isArchived = false,
            snoozedUntil = "",
            note = "",
            photoUrls = listOf("https://photos.app.goo.gl/DQzkTiNsJtEybgpb8"),
        ),
    )

    val sampleLogs: List<KidLogEntry> = listOf(
        KidLogEntry(
            id = "log_1",
            timestamp = "2026-11-27T17:15:00Z",
            kid = "Ale",
            topic = "FR",
            subtopic = "Leçon 4",
            text = "Ho fatto l'esercizio orale e scritto con Ale, ha preso 70/100",
            score = "70/100",
            author = "Riccardo",
        ),
        KidLogEntry(
            id = "log_2",
            timestamp = "2026-11-26T19:40:00Z",
            kid = "Seby",
            topic = "Vita",
            subtopic = "Milestone",
            text = "Seby ha perso il primo dentino! Super fiero",
            author = "Riccardo",
        ),
        KidLogEntry(
            id = "log_3",
            timestamp = "2026-11-25T20:10:00Z",
            kid = "Ale",
            topic = "Vita",
            subtopic = "Storie",
            text = "Ale ha inventato una storia bellissima di un drago che programma in Python",
            author = "Kate",
        ),
    )

    val samplePhotos: List<PhotoAlbumItem> = listOf(
        PhotoAlbumItem(
            url = "https://photos.app.goo.gl/DQzkTiNsJtEybgpb8",
            provider = "Google Photos",
            kidCode = "Seb",
            activity = "Sport",
            title = "Photos: Sports Lesson (Dodgeball)",
            dateIso = "2026-11-17",
            emailId = "alert_gmail_1a1e8bbf95_photos",
        ),
        PhotoAlbumItem(
            url = "https://drive.google.com/drive/folders/1WKFXL1W45mzn8IWTcGlGCjZcG37RKYm1",
            provider = "Google Drive",
            kidCode = "Ale",
            activity = "Classe",
            title = "Primary 3 Weekly Photo Albums",
            dateIso = "2026-11-03",
            emailId = "alert_gmail_1a1a21877e",
        ),
    )

    fun todayForPreview(): LocalDate = LocalDate.of(2026, 11, 30)
}
