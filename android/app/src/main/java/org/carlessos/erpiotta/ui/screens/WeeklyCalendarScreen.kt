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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
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
import java.time.DayOfWeek
import java.time.LocalDate

@Composable
fun WeeklyCalendarScreen(
    items: List<PiotaItem>,
    kidFilter: KidFilter,
    onKidFilterChange: (KidFilter) -> Unit,
    onOpenItem: (PiotaItem) -> Unit,
    referenceToday: LocalDate = LocalDate.now(),
) {
    var weekOffset by remember { mutableIntStateOf(0) }
    var showAiLayer by remember { mutableStateOf(true) }

    // On Sat/Sun, week=0 targets upcoming Monday automatically
    val baseMonday = remember(referenceToday, weekOffset) {
        val delta = when (referenceToday.dayOfWeek) {
            DayOfWeek.SATURDAY -> 2L
            DayOfWeek.SUNDAY -> 1L
            else -> (1 - referenceToday.dayOfWeek.value).toLong()
        }
        referenceToday.plusDays(delta + weekOffset * 7L)
    }

    val days = (0L..6L).map { baseMonday.plusDays(it) }
    val calItems = items.filter { it.type == "event" }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        item {
            KidSegmentedBar(selected = kidFilter, onSelect = onKidFilterChange)
        }

        // Week navigation bar + Layer 2 AI toggle
        item {
            Surface(
                color = PiotaColors.Surface,
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, PiotaColors.Border),
            ) {
                Column(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        NavStepChip("◀ Prec") { weekOffset-- }
                        MonoDateText(
                            text = "${formatShortDateIt(days.first().toString())} – ${formatShortDateIt(days.last().toString())}",
                            color = PiotaColors.Ink,
                        )
                        NavStepChip("Succ ▶") { weekOffset++ }
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Column {
                            Text(
                                text = "Mostra Piotta AI GCal",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = PiotaColors.AiInk,
                            )
                            Text(
                                text = "Ripassi, zaino mattina & eventi WhatsApp (es. 6 dic Kunsthaus)",
                                fontSize = 11.sp,
                                color = PiotaColors.Muted,
                            )
                        }
                        Switch(
                            checked = showAiLayer,
                            onCheckedChange = { showAiLayer = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = PiotaColors.AiInk,
                            ),
                        )
                    }
                }
            }
        }

        // Day cards (Mon–Sun so Dec 6 Sunday Kunsthaus is also visible!)
        days.forEach { day ->
            val iso = day.toString()
            val isToday = day == referenceToday
            val dayEvents = calItems.filter { ev ->
                ev.primaryDate == iso &&
                    (showAiLayer || !ev.isAiLayer) &&
                    (kidFilter == KidFilter.ALL || ev.kidCode == kidFilter.code || ev.kidCode == "A+S")
            }
            // Show Mon–Fri always; show Sat/Sun when they have events (e.g. Dec 6 Kunsthaus!)
            val isWeekend = day.dayOfWeek == DayOfWeek.SATURDAY || day.dayOfWeek == DayOfWeek.SUNDAY
            if (!isWeekend || dayEvents.isNotEmpty()) {
                item(key = "day_$iso") {
                    DayScheduleCard(
                        dateIso = iso,
                        isToday = isToday,
                        events = dayEvents,
                        onOpenItem = onOpenItem,
                    )
                }
            }
        }
    }
}

@Composable
private fun NavStepChip(label: String, onClick: () -> Unit) {
    Surface(
        modifier = Modifier.clickable(onClick = onClick),
        color = PiotaColors.SurfaceMuted,
        shape = RoundedCornerShape(6.dp),
        border = BorderStroke(1.dp, PiotaColors.BorderStrong),
    ) {
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold,
            color = PiotaColors.Ink,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
        )
    }
}

@Composable
private fun DayScheduleCard(
    dateIso: String,
    isToday: Boolean,
    events: List<PiotaItem>,
    onOpenItem: (PiotaItem) -> Unit,
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = if (isToday) Color(0xFFF0F7FF) else PiotaColors.Surface,
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, if (isToday) PiotaColors.AleBorder else PiotaColors.Border),
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 9.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = formatShortDateIt(dateIso),
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isToday) PiotaColors.AleInk else PiotaColors.Ink,
                )
                if (isToday) {
                    Text(
                        text = "OGGI",
                        style = MaterialTheme.typography.labelSmall,
                        color = PiotaColors.AleInk,
                    )
                }
            }

            if (events.isEmpty()) {
                Text(
                    text = "Nessuna scadenza",
                    fontSize = 12.sp,
                    color = PiotaColors.Muted,
                )
            } else {
                events.forEach { ev ->
                    val bg = if (ev.isAiLayer) Color(0xFFFAF8FF) else PiotaColors.SurfaceMuted
                    val border = if (ev.isAiLayer) PiotaColors.BothBorder else PiotaColors.Border
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onOpenItem(ev) },
                        color = bg,
                        shape = RoundedCornerShape(7.dp),
                        border = BorderStroke(1.dp, border),
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                        ) {
                            ProvenanceBadge(ev.provenance)
                            KidChip(ev.kidCode, showAvatar = false)
                            Text(
                                text = ev.cleanTitle,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = PiotaColors.Ink,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.weight(1f),
                            )
                        }
                    }
                }
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 390, heightDp = 760)
@Composable
fun WeeklyCalendarScreenPreview() {
    ErPiottaTheme {
        Surface(color = PiotaColors.Canvas) {
            WeeklyCalendarScreen(
                items = PreviewFixtures.sampleItems,
                kidFilter = KidFilter.ALL,
                onKidFilterChange = {},
                onOpenItem = {},
                referenceToday = PreviewFixtures.todayForPreview(),
            )
        }
    }
}
