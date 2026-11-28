package org.carlessos.erpiotta.ui.screens

import android.app.Activity
import android.content.Intent
import android.speech.RecognizerIntent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Mic
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.FilledTonalIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.carlessos.erpiotta.ui.theme.ErPiottaTheme
import org.carlessos.erpiotta.ui.theme.PiotaColors

private val LOG_TOPICS = listOf("Piano", "Math", "FR", "DE", "EN", "Vita", "Altro")

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun QuickLogSheetContent(
    initialKid: String = "Ale",
    onDismiss: () -> Unit,
    onSave: (kid: String, topic: String, subtopic: String, text: String, score: String, syncSeptober: Boolean) -> Unit,
) {
    var selectedKid by remember { mutableStateOf(initialKid) }
    var selectedTopic by remember { mutableStateOf("FR") }
    var subtopic by remember { mutableStateOf("") }
    var text by remember { mutableStateOf("") }
    var score by remember { mutableStateOf("") }
    var syncSeptober by remember { mutableStateOf(false) } // Default OFF per Riccardo's request

    val voiceLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { res ->
        if (res.resultCode == Activity.RESULT_OK) {
            val spoken = res.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()?.trim()
            if (!spoken.isNullOrBlank()) {
                text = if (text.isBlank()) spoken else "$text $spoken"
            }
        }
    }

    fun startVoiceDictation() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "it-IT")
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Detta la nota per $selectedKid...")
        }
        try {
            voiceLauncher.launch(intent)
        } catch (_: Exception) {
        }
    }

    Surface(
        color = PiotaColors.Surface,
        shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Text(
                text = "Nuovo Log · Ale & Seby",
                style = MaterialTheme.typography.titleLarge,
                color = PiotaColors.Ink,
            )
            Text(
                text = "Compiti svolti, voti (es. 70/100) o ricordi (es. primo dentino, storia del drago).",
                style = MaterialTheme.typography.bodySmall,
                color = PiotaColors.Muted,
            )

            // Kid selector
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("Ale", "Seby", "A+S").forEach { kid ->
                    val active = selectedKid == kid
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .clickable { selectedKid = kid },
                        color = if (active) PiotaColors.Ink else PiotaColors.SurfaceMuted,
                        shape = RoundedCornerShape(8.dp),
                        border = BorderStroke(1.dp, if (active) PiotaColors.Ink else PiotaColors.BorderStrong),
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center,
                            modifier = Modifier.padding(vertical = 8.dp),
                        ) {
                            Text(
                                text = if (kid == "A+S") "Ale + Seby" else kid,
                                color = if (active) Color.White else PiotaColors.Slate,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                            )
                        }
                    }
                }
            }

            // Topic pills
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                LOG_TOPICS.forEach { topic ->
                    val active = selectedTopic == topic
                    Surface(
                        modifier = Modifier.clickable { selectedTopic = topic },
                        color = if (active) PiotaColors.AleBg else PiotaColors.SurfaceMuted,
                        shape = RoundedCornerShape(6.dp),
                        border = BorderStroke(1.dp, if (active) PiotaColors.AleInk else PiotaColors.Border),
                    ) {
                        Text(
                            text = topic,
                            color = if (active) PiotaColors.AleInk else PiotaColors.Slate,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                        )
                    }
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = subtopic,
                    onValueChange = { subtopic = it },
                    label = { Text("Subtopic (opz.)", fontSize = 12.sp) },
                    placeholder = { Text("es. Leçon 4, Dentino", fontSize = 12.sp) },
                    singleLine = true,
                    modifier = Modifier.weight(1.2f),
                )
                OutlinedTextField(
                    value = score,
                    onValueChange = { score = it },
                    label = { Text("Voto (opz.)", fontSize = 12.sp) },
                    placeholder = { Text("70/100", fontSize = 12.sp) },
                    singleLine = true,
                    modifier = Modifier.weight(0.8f),
                )
            }

            Row(
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth(),
            ) {
                OutlinedTextField(
                    value = text,
                    onValueChange = { text = it },
                    label = { Text("Nota / Evento (o premi 🎤)") },
                    placeholder = { Text("Premi il microfono e parla...") },
                    minLines = 3,
                    maxLines = 5,
                    modifier = Modifier.weight(1f),
                )
                FilledTonalIconButton(
                    onClick = ::startVoiceDictation,
                    colors = IconButtonDefaults.filledTonalIconButtonColors(
                        containerColor = PiotaColors.AleBg,
                        contentColor = PiotaColors.AleInk,
                    ),
                    modifier = Modifier.padding(top = 8.dp),
                ) {
                    Icon(Icons.Outlined.Mic, contentDescription = "Detta nota vocale")
                }
            }

            // Optional Septober sync toggle (default false)
            Surface(
                color = PiotaColors.SurfaceMuted,
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, PiotaColors.Border),
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { syncSeptober = !syncSeptober },
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                ) {
                    Checkbox(
                        checked = syncSeptober,
                        onCheckedChange = { syncSeptober = it },
                        colors = CheckboxDefaults.colors(checkedColor = PiotaColors.Ink),
                    )
                    Column {
                        Text(
                            text = "Crea anche TODO azionabile su Septober",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = PiotaColors.Ink,
                        )
                        Text(
                            text = "Facoltativo (spento di default — usa solo se richiede un'azione)",
                            fontSize = 11.sp,
                            color = PiotaColors.Muted,
                        )
                    }
                }
            }

            Spacer(Modifier.height(2.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                OutlinedButton(
                    onClick = onDismiss,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp),
                ) {
                    Text("Annulla", color = PiotaColors.Slate)
                }
                Button(
                    onClick = {
                        if (text.isNotBlank()) {
                            onSave(selectedKid, selectedTopic, subtopic, text, score, syncSeptober)
                        }
                    },
                    enabled = text.isNotBlank(),
                    modifier = Modifier.weight(1.4f),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PiotaColors.Ink),
                ) {
                    Text("Salva Log", color = Color.White, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 620)
@Composable
fun QuickLogSheetPreview() {
    ErPiottaTheme {
        QuickLogSheetContent(
            initialKid = "Ale",
            onDismiss = {},
            onSave = { _, _, _, _, _, _ -> },
        )
    }
}
