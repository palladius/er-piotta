package org.carlessos.erpiotta.ui.screens

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.automirrored.outlined.OpenInNew
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.Mic
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.carlessos.erpiotta.data.PiotaItem
import org.carlessos.erpiotta.data.PreviewFixtures
import org.carlessos.erpiotta.data.ProvenanceKind
import org.carlessos.erpiotta.ui.theme.ErPiottaTheme
import org.carlessos.erpiotta.ui.theme.PiotaColors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemDetailScreen(
    item: PiotaItem,
    onBack: () -> Unit,
    onArchive: () -> Unit,
    onSnooze7d: () -> Unit,
    onSaveNote: (String) -> Unit,
    onOpenExternalUrl: (String) -> Unit,
) {
    var noteText by remember(item.id) { mutableStateOf(item.note) }

    val voiceLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { res ->
        if (res.resultCode == Activity.RESULT_OK) {
            val spoken = res.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()?.trim()
            if (!spoken.isNullOrBlank()) {
                noteText = if (noteText.isBlank()) spoken else "$noteText $spoken"
            }
        }
    }

    fun startVoiceNote() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "it-IT")
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Detta la nota per questo elemento...")
        }
        try {
            voiceLauncher.launch(intent)
        } catch (_: Exception) {
        }
    }

    Scaffold(
        containerColor = PiotaColors.Surface,
        topBar = {
            Column {
                TopAppBar(
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = PiotaColors.Surface),
                    navigationIcon = {
                        IconButton(onClick = onBack) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Outlined.ArrowBack,
                                contentDescription = "Indietro",
                                tint = PiotaColors.Ink,
                            )
                        }
                    },
                    title = {
                        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                            ) {
                                ProvenanceBadge(item.provenance)
                                KidChip(item.kidCode, showAvatar = false)
                            }
                            Text(
                                text = item.cleanTitle,
                                style = MaterialTheme.typography.titleMedium,
                                color = PiotaColors.Ink,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                    },
                )
                HorizontalDivider(color = PiotaColors.Border)
            }
        },
        bottomBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PiotaColors.Surface)
                    .navigationBarsPadding()
                    .imePadding(),
            ) {
                HorizontalDivider(color = PiotaColors.Border)
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(PiotaColors.SurfaceMuted)
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                ) {
                    FilledTonalIconButton(
                        onClick = ::startVoiceNote,
                        colors = IconButtonDefaults.filledTonalIconButtonColors(
                            containerColor = PiotaColors.AleBg,
                            contentColor = PiotaColors.AleInk,
                        ),
                    ) {
                        Icon(Icons.Outlined.Mic, contentDescription = "Detta nota vocale")
                    }
                    OutlinedTextField(
                        value = noteText,
                        onValueChange = { noteText = it },
                        placeholder = { Text("Premi 🎤 o scrivi nota...", fontSize = 13.sp) },
                        singleLine = true,
                        shape = RoundedCornerShape(7.dp),
                        modifier = Modifier.weight(1f),
                    )
                    OutlinedButton(
                        onClick = { onSaveNote(noteText.trim()) },
                        shape = RoundedCornerShape(7.dp),
                    ) {
                        Text("Salva", color = PiotaColors.Ink, fontWeight = FontWeight.SemiBold)
                    }
                }

                HorizontalDivider(color = PiotaColors.Border)
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 10.dp),
                ) {
                    Button(
                        onClick = onArchive,
                        shape = RoundedCornerShape(7.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = PiotaColors.Ink),
                    ) {
                        Icon(Icons.Outlined.Check, contentDescription = null)
                        Spacer(Modifier.width(4.dp))
                        Text("Archivia", color = Color.White, fontWeight = FontWeight.SemiBold)
                    }
                    OutlinedButton(
                        onClick = onSnooze7d,
                        shape = RoundedCornerShape(7.dp),
                    ) {
                        Icon(Icons.Outlined.Schedule, contentDescription = null, tint = PiotaColors.Slate)
                        Spacer(Modifier.width(4.dp))
                        Text("Snooze 7g", color = PiotaColors.Slate)
                    }
                    Spacer(Modifier.weight(1f))
                    if (item.sourceUrl.startsWith("http")) {
                        IconButton(onClick = { onOpenExternalUrl(item.sourceUrl) }) {
                            Icon(
                                Icons.AutoMirrored.Outlined.OpenInNew,
                                contentDescription = "Apri sorgente",
                                tint = PiotaColors.AleInk,
                            )
                        }
                    }
                }
            }
        },
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState()),
        ) {
            // Structured Provenance Strip
            val provBg = if (item.provenance == ProvenanceKind.AI_AUTO) Color(0xFFFAF8FF) else PiotaColors.SurfaceMuted
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(provBg)
                    .padding(horizontal = 16.dp, vertical = 10.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                ProvenanceMetaRow(
                    label = when (item.provenance) {
                        ProvenanceKind.EMAIL -> "MITTENTE"
                        ProvenanceKind.GCAL -> "CALENDARIO"
                        ProvenanceKind.WHATSAPP -> "GRUPPO"
                        ProvenanceKind.AI_AUTO -> "GENERATORE"
                        ProvenanceKind.PIOTA_LEGACY -> "MITTENTE"
                    },
                    value = item.fromLine,
                )
                ProvenanceMetaRow(
                    label = if (item.provenance == ProvenanceKind.EMAIL) "SUBJECT" else "OGGETTO",
                    value = item.title,
                    bold = true,
                )
                ProvenanceMetaRow(
                    label = "DATA",
                    value = item.timestampYmdHm,
                    mono = true,
                )
                ProvenanceMetaRow(
                    label = "ORIGINE",
                    value = item.provenanceDetail,
                    accent = item.provenance == ProvenanceKind.AI_AUTO,
                )
            }

            HorizontalDivider(color = PiotaColors.Border)

            Column(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 14.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Text(
                    text = item.body.ifBlank { "Nessun testo aggiuntivo." },
                    style = MaterialTheme.typography.bodyMedium,
                    color = PiotaColors.Ink,
                )

                if (item.photoUrls.isNotEmpty()) {
                    Surface(
                        color = PiotaColors.BothBg,
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(1.dp, PiotaColors.BothBorder),
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Column(
                            modifier = Modifier.padding(12.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp),
                        ) {
                            Text(
                                text = "ALBUM FOTO COLLEGATI",
                                style = MaterialTheme.typography.labelSmall,
                                color = PiotaColors.BothInk,
                            )
                            item.photoUrls.forEach { url ->
                                OutlinedButton(
                                    onClick = { onOpenExternalUrl(url) },
                                    shape = RoundedCornerShape(7.dp),
                                ) {
                                    Icon(Icons.AutoMirrored.Outlined.OpenInNew, contentDescription = null)
                                    Spacer(Modifier.width(6.dp))
                                    Text("Apri Album Foto")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ProvenanceMetaRow(
    label: String,
    value: String,
    bold: Boolean = false,
    mono: Boolean = false,
    accent: Boolean = false,
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top,
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = PiotaColors.Muted,
            modifier = Modifier.width(82.dp),
        )
        Text(
            text = value,
            fontSize = 12.sp,
            fontFamily = if (mono) FontFamily.Monospace else FontFamily.SansSerif,
            fontWeight = if (bold || mono || accent) FontWeight.SemiBold else FontWeight.Normal,
            color = if (accent) PiotaColors.AiInk else PiotaColors.Ink,
            modifier = Modifier.weight(1f),
        )
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 760)
@Composable
fun ItemDetailScreenPreview() {
    ErPiottaTheme {
        ItemDetailScreen(
            item = PreviewFixtures.sampleItems[1],
            onBack = {},
            onArchive = {},
            onSnooze7d = {},
            onSaveNote = {},
            onOpenExternalUrl = {},
        )
    }
}
