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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.carlessos.erpiotta.data.KidFilter
import org.carlessos.erpiotta.data.PiotaItem
import org.carlessos.erpiotta.data.PreviewFixtures
import org.carlessos.erpiotta.ui.theme.ErPiottaTheme
import org.carlessos.erpiotta.ui.theme.PiotaColors

@Composable
fun NewsInboxScreen(
    items: List<PiotaItem>,
    kidFilter: KidFilter,
    onKidFilterChange: (KidFilter) -> Unit,
    onOpenItem: (PiotaItem) -> Unit,
) {
    var query by remember { mutableStateOf("") }
    var showArchived by remember { mutableStateOf(false) }

    val filtered = items.filter { it ->
        val matchArch = if (showArchived) it.isArchived else !it.isArchived
        val matchKid = kidFilter == KidFilter.ALL || it.kidCode == kidFilter.code || it.kidCode == "A+S"
        val q = query.trim().lowercase()
        val matchQ = q.isEmpty() ||
            it.cleanTitle.lowercase().contains(q) ||
            it.fromLine.lowercase().contains(q) ||
            it.snippet.lowercase().contains(q)
        matchArch && matchKid && matchQ
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        item {
            KidSegmentedBar(selected = kidFilter, onSelect = onKidFilterChange)
        }

        item {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                OutlinedTextField(
                    value = query,
                    onValueChange = { query = it },
                    leadingIcon = { Icon(Icons.Outlined.Search, contentDescription = null, tint = PiotaColors.Muted) },
                    placeholder = { Text("Cerca email, docenti, WA...", fontSize = 13.sp) },
                    singleLine = true,
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.weight(1f),
                )
                Surface(
                    modifier = Modifier.clickable { showArchived = !showArchived },
                    color = if (showArchived) PiotaColors.Ink else PiotaColors.Surface,
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, PiotaColors.BorderStrong),
                ) {
                    Text(
                        text = if (showArchived) "Archiviati" else "Attivi",
                        color = if (showArchived) androidx.compose.ui.graphics.Color.White else PiotaColors.Slate,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 14.dp),
                    )
                }
            }
        }

        item {
            Text(
                text = "FILTRATI CON AGENTS.MD · ${filtered.size} ELEMENTI",
                style = MaterialTheme.typography.labelSmall,
                color = PiotaColors.Muted,
            )
        }

        items(filtered, key = { it.id }) { item ->
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onOpenItem(item) },
                color = PiotaColors.Surface,
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, PiotaColors.Border),
            ) {
                Column(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 10.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        ProvenanceBadge(item.provenance)
                        KidChip(item.kidCode, showAvatar = false)
                        Spacer(Modifier.weight(1f))
                        MonoDateText(item.timestampYmdHm)
                    }
                    Text(
                        text = item.cleanTitle,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = PiotaColors.Ink,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        text = item.fromLine,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = PiotaColors.Slate,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    if (item.snippet.isNotBlank()) {
                        Text(
                            text = item.snippet,
                            fontSize = 12.sp,
                            color = PiotaColors.Muted,
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 760)
@Composable
fun NewsInboxScreenPreview() {
    ErPiottaTheme {
        Surface(color = PiotaColors.Canvas) {
            NewsInboxScreen(
                items = PreviewFixtures.sampleItems,
                kidFilter = KidFilter.ALL,
                onKidFilterChange = {},
                onOpenItem = {},
            )
        }
    }
}
