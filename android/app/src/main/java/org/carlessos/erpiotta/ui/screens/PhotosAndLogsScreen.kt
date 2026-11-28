package org.carlessos.erpiotta.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.OpenInNew
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.carlessos.erpiotta.data.KidLogEntry
import org.carlessos.erpiotta.data.PhotoAlbumItem
import org.carlessos.erpiotta.data.PreviewFixtures
import org.carlessos.erpiotta.ui.theme.ErPiottaTheme
import org.carlessos.erpiotta.ui.theme.PiotaColors

@Composable
fun PhotosAndLogsScreen(
    photos: List<PhotoAlbumItem>,
    logs: List<KidLogEntry>,
    onOpenUrl: (String) -> Unit,
    onAddNewLog: () -> Unit,
) {
    var subTab by remember { mutableIntStateOf(0) } // 0 = Log Bimbi, 1 = Album Foto

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        item {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = PiotaColors.SurfaceMuted,
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, PiotaColors.BorderStrong),
            ) {
                Row(
                    modifier = Modifier.padding(3.dp),
                    horizontalArrangement = Arrangement.spacedBy(3.dp),
                ) {
                    listOf("Log Bimbi (${logs.size})", "Album Foto (${photos.size})").forEachIndexed { idx, label ->
                        val sel = subTab == idx
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (sel) PiotaColors.Ink else Color.Transparent)
                                .clickable { subTab = idx }
                                .padding(vertical = 8.dp),
                        ) {
                            Text(
                                text = label,
                                color = if (sel) Color.White else PiotaColors.Slate,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                            )
                        }
                    }
                }
            }
        }

        if (subTab == 0) {
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(onClick = onAddNewLog),
                    color = PiotaColors.Surface,
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, PiotaColors.Ink),
                ) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier.padding(vertical = 10.dp),
                    ) {
                        Text(
                            text = "+ Registra Log / Milestone (Ale o Seby)",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = PiotaColors.Ink,
                        )
                    }
                }
            }
            items(logs, key = { it.id }) { log ->
                CompactLogCard(log = log)
            }
        } else {
            items(photos, key = { it.url }) { pa ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onOpenUrl(pa.url) },
                    color = PiotaColors.Surface,
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, PiotaColors.Border),
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                    ) {
                        Column(
                            modifier = Modifier.weight(1f),
                            verticalArrangement = Arrangement.spacedBy(3.dp),
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp),
                            ) {
                                KidChip(pa.kidCode, showAvatar = true)
                                Surface(
                                    color = PiotaColors.SurfaceMuted,
                                    shape = RoundedCornerShape(4.dp),
                                    border = BorderStroke(1.dp, PiotaColors.Border),
                                ) {
                                    Text(
                                        text = pa.activity,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = PiotaColors.Slate,
                                        modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp),
                                    )
                                }
                                Spacer(Modifier.weight(1f))
                                MonoDateText(pa.dateIso)
                            }
                            Text(
                                text = pa.title,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = PiotaColors.Ink,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                            Text(
                                text = pa.provider,
                                fontSize = 11.sp,
                                color = PiotaColors.AleInk,
                                fontWeight = FontWeight.Medium,
                            )
                        }
                        Icon(
                            imageVector = Icons.AutoMirrored.Outlined.OpenInNew,
                            contentDescription = "Apri album",
                            tint = PiotaColors.AleInk,
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 760)
@Composable
fun PhotosAndLogsScreenPreview() {
    ErPiottaTheme {
        Surface(color = PiotaColors.Canvas) {
            PhotosAndLogsScreen(
                photos = PreviewFixtures.samplePhotos,
                logs = PreviewFixtures.sampleLogs,
                onOpenUrl = {},
                onAddNewLog = {},
            )
        }
    }
}
