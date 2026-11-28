package org.carlessos.erpiotta.ui.screens

import android.media.MediaPlayer
import android.speech.tts.TextToSpeech
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.VolumeUp
import androidx.compose.material.icons.outlined.StopCircle
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.carlessos.erpiotta.BuildConfig
import org.carlessos.erpiotta.R
import org.carlessos.erpiotta.data.PiotaItem
import org.carlessos.erpiotta.data.PreviewFixtures
import org.carlessos.erpiotta.data.ProvenanceKind
import org.carlessos.erpiotta.ui.theme.ErPiottaTheme
import org.carlessos.erpiotta.ui.theme.PiotaColors
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale

private val TEST_KEYWORDS = listOf("test", "lzk", "lernzielkontrolle", "sats", "assessment", "verifica", "esame")
private val HW_KEYWORDS = listOf("homework", "hw:", "compiti", "ripasso", "übungsheft", "schreibheft", "ziffern")
private val ZAINO_KEYWORDS = listOf("zaino", "piano", "spartiti", "cartellina", "reading book", "spelling folder", "library", "biblioteca")

private fun isUrgentTest(title: String): Boolean =
    TEST_KEYWORDS.any { title.lowercase().contains(it) }

private fun isHomework(title: String): Boolean =
    HW_KEYWORDS.any { title.lowercase().contains(it) }

private fun isZaino(title: String): Boolean =
    ZAINO_KEYWORDS.any { title.lowercase().contains(it) }

private fun formatCompactDayNoMonth(isoDate: String): String {
    if (isoDate.length < 10) return isoDate
    return try {
        val d = java.time.LocalDate.parse(isoDate.take(10))
        val today = java.time.LocalDate.now()
        val wds = listOf("Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom")
        val mons = listOf("Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic")
        val wd = wds[d.dayOfWeek.value - 1]
        if (d.monthValue == today.monthValue && d.year == today.year) {
            "$wd ${d.dayOfMonth}"
        } else {
            "$wd ${d.dayOfMonth} ${mons[d.monthValue - 1]}"
        }
    } catch (_: Exception) {
        isoDate.take(10)
    }
}

private data class SynopsisData(
    val lead: AnnotatedString,
    val rest: AnnotatedString?,
    val full: AnnotatedString,
    val plain: String,
)

private fun AnnotatedString.Builder.appendStyledToken(it: PiotaItem) {
    val token = "📅 ${formatCompactDayNoMonth(it.primaryDate)} ${it.cleanTitle}"
    when {
        isUrgentTest(it.cleanTitle) -> withStyle(SpanStyle(color = PiotaColors.TestAccent, fontWeight = FontWeight.Bold)) {
            append(token)
        }
        isHomework(it.cleanTitle) -> withStyle(SpanStyle(color = PiotaColors.HwAccent, fontWeight = FontWeight.SemiBold)) {
            append(token)
        }
        isZaino(it.cleanTitle) -> withStyle(SpanStyle(color = PiotaColors.EventAccent, fontWeight = FontWeight.SemiBold)) {
            append(token)
        }
        else -> append(token)
    }
}

private fun buildStyledTokens(items: List<PiotaItem>, emptyMsg: String): SynopsisData {
    if (items.isEmpty()) {
        val empty = AnnotatedString(emptyMsg)
        return SynopsisData(lead = empty, rest = null, full = empty, plain = emptyMsg)
    }
    val top = items.take(4)
    val lead = buildAnnotatedString { appendStyledToken(top.first()) }
    val restList = top.drop(1)
    val rest = if (restList.isEmpty()) null else buildAnnotatedString {
        restList.forEachIndexed { idx, it ->
            if (idx > 0) append("  ")
            appendStyledToken(it)
        }
    }
    val full = buildAnnotatedString {
        top.forEachIndexed { idx, it ->
            if (idx > 0) append("  ")
            appendStyledToken(it)
        }
    }
    val plain = top.joinToString(". ") { "${formatCompactDayNoMonth(it.primaryDate)}: ${it.cleanTitle}" }
    return SynopsisData(lead = lead, rest = rest, full = full, plain = plain)
}

private fun buildAleSynopsis(items: List<PiotaItem>): SynopsisData {
    val today = java.time.LocalDate.now().toString()
    val in7d = java.time.LocalDate.now().plusDays(8).toString()
    val upcoming = items.filter {
        !it.isArchived && it.kidCode == "Ale" && it.isActionRequired &&
            (it.type == "alert" || (it.primaryDate >= today && it.primaryDate <= in7d))
    }
    return buildStyledTokens(upcoming, "Tutto tranquillo nei prossimi 7 giorni.")
}

private fun buildSebySynopsis(items: List<PiotaItem>): SynopsisData {
    val today = java.time.LocalDate.now().toString()
    val in7d = java.time.LocalDate.now().plusDays(8).toString()
    val upcoming = items.filter {
        !it.isArchived && it.kidCode == "Seb" && it.isActionRequired &&
            (it.type == "alert" || (it.primaryDate >= today && it.primaryDate <= in7d))
    }
    return buildStyledTokens(upcoming, "Tutto tranquillo nei prossimi 7 giorni.")
}

private fun buildRiccardoSynopsis(items: List<PiotaItem>): SynopsisData {
    val today = java.time.LocalDate.now().toString()
    val in14d = java.time.LocalDate.now().plusDays(15).toString()
    val adminAndEvents = items.filter {
        !it.isArchived &&
            (it.type == "alert" || (it.primaryDate >= today && it.primaryDate <= in14d)) &&
            (
                it.kidCode == "A+S" ||
                    it.provenance == ProvenanceKind.WHATSAPP ||
                    listOf("ptc", "silvesterlauf", "billing", "christmas", "kunsthaus", "schuhgrösse").any { k ->
                        it.cleanTitle.lowercase().contains(k)
                    }
                )
    }
    return buildStyledTokens(adminAndEvents, "Nessuna quota, PTC o evento genitori aperto.")
}

private suspend fun fetchGeminiTtsWav(cacheDir: File, cardId: String, text: String, voice: String): File? =
    withContext(Dispatchers.IO) {
        try {
            val conn = (URL("${BuildConfig.API_BASE_URL}/api/tts").openConnection() as HttpURLConnection).apply {
                connectTimeout = 4000
                readTimeout = 20000
                requestMethod = "POST"
                doOutput = true
                setRequestProperty("Content-Type", "application/json")
            }
            val payload = """{"text":${Json.encodeToString(text)},"voice":${Json.encodeToString(voice)}}"""
            conn.outputStream.use { it.write(payload.toByteArray(Charsets.UTF_8)) }
            if (conn.responseCode == 200) {
                val outFile = File(cacheDir, "tts_${cardId}_${text.hashCode()}.wav")
                conn.inputStream.use { inp -> outFile.outputStream().use { inp.copyTo(it) } }
                if (outFile.length() > 100) return@withContext outFile
            }
            null
        } catch (_: Exception) {
            null
        }
    }

@Composable
fun HomeScreen(
    items: List<PiotaItem>,
    onOpenAle: () -> Unit,
    onOpenSeby: () -> Unit,
    onOpenRiccardo: () -> Unit,
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var speakingCardId by remember { mutableStateOf<String?>(null) }
    var loadingCardId by remember { mutableStateOf<String?>(null) }
    var mediaPlayer by remember { mutableStateOf<MediaPlayer?>(null) }

    val fallbackTts = remember {
        var instance: TextToSpeech? = null
        instance = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                instance?.language = Locale.ITALIAN
            }
        }
        instance
    }

    fun stopAllAudio() {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
        } catch (_: Exception) {
        }
        mediaPlayer = null
        fallbackTts.stop()
        speakingCardId = null
        loadingCardId = null
    }

    DisposableEffect(Unit) {
        onDispose {
            stopAllAudio()
            fallbackTts.shutdown()
        }
    }

    fun toggleSpeak(cardId: String, spokenText: String, voice: String) {
        if (speakingCardId == cardId || loadingCardId == cardId) {
            stopAllAudio()
            return
        }
        stopAllAudio()
        loadingCardId = cardId
        scope.launch {
            val wavFile = fetchGeminiTtsWav(context.cacheDir, cardId, spokenText, voice)
            if (loadingCardId != cardId) return@launch // cancelled
            loadingCardId = null
            if (wavFile != null) {
                try {
                    val mp = MediaPlayer().apply {
                        setDataSource(wavFile.absolutePath)
                        prepare()
                        setOnCompletionListener {
                            speakingCardId = null
                            it.release()
                            mediaPlayer = null
                        }
                        start()
                    }
                    mediaPlayer = mp
                    speakingCardId = cardId
                    return@launch
                } catch (_: Exception) {
                }
            }
            // Offline fallback only
            speakingCardId = cardId
            fallbackTts.speak(spokenText, TextToSpeech.QUEUE_FLUSH, null, cardId)
        }
    }

    val aleSyn = remember(items) { buildAleSynopsis(items) }
    val sebSyn = remember(items) { buildSebySynopsis(items) }
    val ricSyn = remember(items) { buildRiccardoSynopsis(items) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 12.dp, vertical = 10.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        // 1/3: Ale (P3) — Flush North-West portrait, no static subtitle, first event starts right beside portrait!
        SynopsisHeroCard(
            name = "Ale (P3)",
            subtitle = null,
            synopsis = aleSyn,
            avatarRes = R.drawable.avatar_ale,
            avatarSizeDp = 92,
            cardBg = Color(0xFFF5F9FF),
            borderColor = PiotaColors.AleBorder,
            accentColor = PiotaColors.AleInk,
            isSpeaking = speakingCardId == "ale",
            isLoading = loadingCardId == "ale",
            onToggleAudio = {
                toggleSpeak("ale", "Ciao! Ecco cosa bolle in pentola per Alessandro in Primary 3: ${aleSyn.plain}", "Puck")
            },
            onClick = onOpenAle,
            modifier = Modifier.weight(1f),
        )

        // 1/3: Seby (P1) — Flush North-West portrait (NEW Pixar Seby!), no static subtitle!
        SynopsisHeroCard(
            name = "Seby (P1)",
            subtitle = null,
            synopsis = sebSyn,
            avatarRes = R.drawable.avatar_sebi,
            avatarSizeDp = 92,
            cardBg = Color(0xFFF3FDF7),
            borderColor = PiotaColors.SebBorder,
            accentColor = PiotaColors.SebInk,
            isSpeaking = speakingCardId == "seby",
            isLoading = loadingCardId == "seby",
            onToggleAudio = {
                toggleSpeak("seby", "Ciao! Ecco cosa c'è per Sebastian in Primary 1: ${sebSyn.plain}", "Kore")
            },
            onClick = onOpenSeby,
            modifier = Modifier.weight(1f),
        )

        // 1/3: Riccardo — Keep subtitle, remove "Altro", compact Flush North-West portrait
        SynopsisHeroCard(
            name = "Riccardo",
            subtitle = "Quote, PTC & Genitori",
            synopsis = ricSyn,
            avatarRes = R.drawable.avatar_riccardo,
            avatarSizeDp = 64,
            cardBg = Color(0xFFFFFBF2),
            borderColor = Color(0xFFFDE68A),
            accentColor = Color(0xFFB45309),
            isSpeaking = speakingCardId == "riccardo",
            isLoading = loadingCardId == "riccardo",
            onToggleAudio = {
                toggleSpeak("riccardo", "Ecco tutto il resto per Riccardo e famiglia: ${ricSyn.plain}", "Fenrir")
            },
            onClick = onOpenRiccardo,
            reserveFabSpace = true,
            modifier = Modifier.weight(1f),
        )
    }
}

@Composable
private fun SynopsisHeroCard(
    name: String,
    subtitle: String?,
    synopsis: SynopsisData,
    avatarRes: Int,
    avatarSizeDp: Int,
    cardBg: Color,
    borderColor: Color,
    accentColor: Color,
    isSpeaking: Boolean,
    isLoading: Boolean,
    onToggleAudio: () -> Unit,
    onClick: () -> Unit,
    reserveFabSpace: Boolean = false,
    modifier: Modifier = Modifier,
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        color = cardBg,
        shape = RoundedCornerShape(14.dp),
        border = BorderStroke(1.5.dp, borderColor),
        shadowElevation = 1.dp,
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Top,
        ) {
            // Top Row: Flush North-West square-rounded portrait (ZERO top/left margin!)
            Row(
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.fillMaxWidth(),
            ) {
                Image(
                    painter = painterResource(id = avatarRes),
                    contentDescription = name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(avatarSizeDp.dp)
                        .clip(RoundedCornerShape(topStart = 14.dp, bottomEnd = 18.dp)),
                )
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .padding(top = 8.dp, end = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(3.dp),
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = name,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = PiotaColors.Ink,
                                maxLines = 1,
                                softWrap = false,
                            )
                            if (subtitle != null) {
                                Text(
                                    text = subtitle,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = accentColor,
                                    maxLines = 1,
                                )
                            }
                        }

                        FilledTonalIconButton(
                            onClick = onToggleAudio,
                            modifier = Modifier.size(36.dp),
                            colors = IconButtonDefaults.filledTonalIconButtonColors(
                                containerColor = if (isSpeaking) accentColor else Color.White,
                                contentColor = if (isSpeaking) Color.White else accentColor,
                            ),
                        ) {
                            if (isLoading) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(16.dp),
                                    strokeWidth = 2.dp,
                                    color = accentColor,
                                )
                            } else {
                                Icon(
                                    imageVector = if (isSpeaking) Icons.Outlined.StopCircle else Icons.AutoMirrored.Outlined.VolumeUp,
                                    contentDescription = if (isSpeaking) "Ferma audio" else "Ascolta con Gemini TTS",
                                    modifier = Modifier.size(20.dp),
                                )
                            }
                        }
                    }

                    // For Ale & Seby (no static subtitle), start writing the lead event RIGHT HERE beside the portrait!
                    if (subtitle == null) {
                        Text(
                            text = synopsis.lead,
                            fontSize = 13.sp,
                            lineHeight = 17.5.sp,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                            color = PiotaColors.Ink,
                        )
                    }
                }
            }

            // Remaining events flow cleanly across full card width with zero clipping
            val bottomText = if (subtitle == null) synopsis.rest else synopsis.full
            if (bottomText != null) {
                Text(
                    text = bottomText,
                    fontSize = 13.sp,
                    lineHeight = 18.sp,
                    maxLines = if (subtitle == null) 3 else 4,
                    overflow = TextOverflow.Ellipsis,
                    color = PiotaColors.Ink,
                    modifier = Modifier.padding(
                        start = 12.dp,
                        end = if (reserveFabSpace) 68.dp else 12.dp,
                        top = 6.dp,
                        bottom = 10.dp,
                    ),
                )
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 760)
@Composable
fun HomeScreenPreview() {
    ErPiottaTheme {
        Surface(color = PiotaColors.Canvas) {
            HomeScreen(
                items = PreviewFixtures.sampleItems,
                onOpenAle = {},
                onOpenSeby = {},
                onOpenRiccardo = {},
            )
        }
    }
}
