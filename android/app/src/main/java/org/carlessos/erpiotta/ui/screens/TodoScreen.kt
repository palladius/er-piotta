package org.carlessos.erpiotta.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.EditNote
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.carlessos.erpiotta.data.KidFilter
import org.carlessos.erpiotta.data.KidLogEntry
import org.carlessos.erpiotta.data.PiotaItem
import org.carlessos.erpiotta.data.PreviewFixtures
import org.carlessos.erpiotta.ui.theme.ErPiottaTheme
import org.carlessos.erpiotta.ui.theme.PiotaColors

@Composable
fun TodoScreen(
    items: List<PiotaItem>,
    recentLogs: List<KidLogEntry>,
    kidFilter: KidFilter,
    onKidFilterChange: (KidFilter) -> Unit,
    onOpenItem: (PiotaItem) -> Unit,
    onArchiveItem: (PiotaItem) -> Unit,
    onOpenQuickLog: (String) -> Unit,
) {
    val activeTodos = items.filter { !it.isArchived && it.isActionRequired }
    val aleCount = activeTodos.count { it.kidCode == "Ale" || it.kidCode == "A+S" }
    val sebCount = activeTodos.count { it.kidCode == "Seb" || it.kidCode == "A+S" }

    val visibleTodos = activeTodos.filter {
        kidFilter == KidFilter.ALL || it.kidCode == kidFilter.code || it.kidCode == "A+S"
    }

    val aleTodos = visibleTodos.filter { it.kidCode == "Ale" || it.kidCode == "A+S" }
    val sebTodos = visibleTodos.filter { it.kidCode == "Seb" || it.kidCode == "A+S" }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        item {
            KidSegmentedBar(
                selected = kidFilter,
                onSelect = onKidFilterChange,
                aleCount = aleCount,
                sebCount = sebCount,
            )
        }

        // Quick Action Row: Log milestone or study progress for Ale / Seby
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                QuickLogShortcutButton(
                    kidCode = "Ale",
                    label = "+ Nota Ale",
                    onClick = { onOpenQuickLog("Ale") },
                    modifier = Modifier.weight(1f),
                )
                QuickLogShortcutButton(
                    kidCode = "Seb",
                    label = "+ Nota Seby",
                    onClick = { onOpenQuickLog("Seby") },
                    modifier = Modifier.weight(1f),
                )
            }
        }

        if (kidFilter == KidFilter.ALL || kidFilter == KidFilter.ALE) {
            item {
                SectionHeaderRow(
                    title = "TODO Ale · Primary 3",
                    count = aleTodos.size,
                    kidCode = "Ale",
                )
            }
            if (aleTodos.isEmpty()) {
                item { EmptyHintCard("Nessun compito o scadenza aperta per Ale.") }
            } else {
                items(aleTodos.take(8), key = { "ale_${it.id}" }) { item ->
                    TodoItemCard(item = item, onOpen = { onOpenItem(item) }, onArchive = { onArchiveItem(item) })
                }
            }
        }

        if (kidFilter == KidFilter.ALL || kidFilter == KidFilter.SEB) {
            item {
                Spacer(Modifier.height(2.dp))
                SectionHeaderRow(
                    title = "TODO Seby · Primary 1",
                    count = sebTodos.size,
                    kidCode = "Seb",
                )
            }
            if (sebTodos.isEmpty()) {
                item { EmptyHintCard("Nessun compito o scadenza aperta per Seby.") }
            } else {
                items(sebTodos.take(8), key = { "seb_${it.id}" }) { item ->
                    TodoItemCard(item = item, onOpen = { onOpenItem(item) }, onArchive = { onArchiveItem(item) })
                }
            }
        }

        if (recentLogs.isNotEmpty()) {
            item {
                Spacer(Modifier.height(4.dp))
                Text(
                    text = "ULTIMI LOG & MILESTONE",
                    style = MaterialTheme.typography.labelSmall,
                    color = PiotaColors.Muted,
                )
            }
            items(recentLogs.take(3), key = { it.id }) { log ->
                CompactLogCard(log = log)
            }
        }
    }
}

@Composable
private fun QuickLogShortcutButton(
    kidCode: String,
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Surface(
        modifier = modifier.clickable(onClick = onClick),
        color = PiotaColors.Surface,
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, PiotaColors.BorderStrong),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
        ) {
            KidAvatarCircle(kidCode = kidCode, size = 20.dp)
            Spacer(Modifier.padding(horizontal = 3.dp))
            Icon(
                imageVector = Icons.Outlined.EditNote,
                contentDescription = null,
                tint = PiotaColors.Ink,
                modifier = Modifier.padding(end = 4.dp),
            )
            Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = PiotaColors.Ink,
            )
        }
    }
}

@Composable
private fun SectionHeaderRow(title: String, count: Int, kidCode: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.padding(top = 2.dp),
    ) {
        KidAvatarCircle(kidCode = kidCode, size = 22.dp)
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            color = PiotaColors.Ink,
        )
        Surface(
            color = PiotaColors.SurfaceMuted,
            shape = RoundedCornerShape(999.dp),
            border = BorderStroke(1.dp, PiotaColors.Border),
        ) {
            Text(
                text = "$count",
                style = MaterialTheme.typography.labelSmall,
                color = PiotaColors.Slate,
                modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp),
            )
        }
    }
}

@Composable
private fun TodoItemCard(
    item: PiotaItem,
    onOpen: () -> Unit,
    onArchive: () -> Unit,
) {
    val isTest = listOf("test", "lzk", "sats", "assessment").any { item.cleanTitle.lowercase().contains(it) }
    val borderColor = when {
        isTest -> Color(0xFFFCA5A5)
        item.isAiLayer -> PiotaColors.BothBorder
        else -> PiotaColors.Border
    }

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onOpen),
        color = PiotaColors.Surface,
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, borderColor),
    ) {
        Row(
            modifier = Modifier.padding(start = 12.dp, top = 9.dp, bottom = 9.dp, end = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(3.dp),
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    ProvenanceBadge(item.provenance)
                    MonoDateText(formatShortDateIt(item.primaryDate))
                    if (isTest) {
                        Text(
                            text = "VERIFICA",
                            color = PiotaColors.TestAccent,
                            style = MaterialTheme.typography.labelSmall,
                        )
                    }
                }
                Text(
                    text = item.cleanTitle,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PiotaColors.Ink,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                if (item.snippet.isNotBlank()) {
                    Text(
                        text = item.snippet,
                        fontSize = 12.sp,
                        color = PiotaColors.Muted,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
                if (item.note.isNotBlank()) {
                    Text(
                        text = "Nota: ${item.note}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = PiotaColors.HwAccent,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
            IconButton(onClick = onArchive) {
                Icon(
                    imageVector = Icons.Outlined.Check,
                    contentDescription = "Archivia",
                    tint = PiotaColors.Muted,
                )
            }
        }
    }
}

@Composable
fun CompactLogCard(log: KidLogEntry) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = PiotaColors.Surface,
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, PiotaColors.Border),
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 9.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                KidChip(kidCode = log.kid, showAvatar = true)
                Surface(
                    color = PiotaColors.SurfaceMuted,
                    shape = RoundedCornerShape(4.dp),
                    border = BorderStroke(1.dp, PiotaColors.Border),
                ) {
                    Text(
                        text = if (log.subtopic.isNotBlank()) "${log.topic} · ${log.subtopic}" else log.topic,
                        style = MaterialTheme.typography.labelSmall,
                        color = PiotaColors.Slate,
                        modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp),
                    )
                }
                if (log.score.isNotBlank()) {
                    Surface(
                        color = PiotaColors.GCalBg,
                        shape = RoundedCornerShape(4.dp),
                    ) {
                        Text(
                            text = log.score,
                            style = MaterialTheme.typography.labelSmall,
                            color = PiotaColors.GCalInk,
                            modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp),
                        )
                    }
                }
                Spacer(Modifier.weight(1f))
                MonoDateText(log.timestamp.take(10).replace("-", ""))
            }
            Text(
                text = log.text,
                fontSize = 13.sp,
                color = PiotaColors.Ink,
            )
            if (log.septoberLink.isNotBlank()) {
                Text(
                    text = "Septober: ${log.septoberLink}",
                    fontSize = 11.sp,
                    color = PiotaColors.AleInk,
                )
            }
        }
    }
}

@Composable
private fun EmptyHintCard(msg: String) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = PiotaColors.SurfaceMuted,
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, PiotaColors.Border),
    ) {
        Text(
            text = msg,
            fontSize = 12.sp,
            color = PiotaColors.Muted,
            modifier = Modifier.padding(12.dp),
        )
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 760)
@Composable
fun TodoScreenPreview() {
    ErPiottaTheme {
        Surface(color = PiotaColors.Canvas) {
            TodoScreen(
                items = PreviewFixtures.sampleItems,
                recentLogs = PreviewFixtures.sampleLogs,
                kidFilter = KidFilter.ALL,
                onKidFilterChange = {},
                onOpenItem = {},
                onArchiveItem = {},
                onOpenQuickLog = {},
            )
        }
    }
}
