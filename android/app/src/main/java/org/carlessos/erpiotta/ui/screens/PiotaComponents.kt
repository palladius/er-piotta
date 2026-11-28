package org.carlessos.erpiotta.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.carlessos.erpiotta.R
import org.carlessos.erpiotta.data.KidFilter
import org.carlessos.erpiotta.data.ProvenanceKind
import org.carlessos.erpiotta.ui.theme.PiotaColors

@Composable
fun ProvenanceBadge(kind: ProvenanceKind, modifier: Modifier = Modifier) {
    val (bg, fg, border) = when (kind) {
        ProvenanceKind.EMAIL -> Triple(PiotaColors.EmailBg, PiotaColors.EmailInk, PiotaColors.AleBorder)
        ProvenanceKind.GCAL -> Triple(PiotaColors.GCalBg, PiotaColors.GCalInk, PiotaColors.SebBorder)
        ProvenanceKind.WHATSAPP -> Triple(PiotaColors.WhatsAppBg, PiotaColors.WhatsAppInk, Color(0xFFA7F3D0))
        ProvenanceKind.AI_AUTO -> Triple(PiotaColors.AiBg, PiotaColors.AiInk, PiotaColors.BothBorder)
        ProvenanceKind.PIOTA_LEGACY -> Triple(PiotaColors.LegacyBg, PiotaColors.LegacyInk, PiotaColors.BorderStrong)
    }
    Surface(
        modifier = modifier,
        color = bg,
        shape = RoundedCornerShape(4.dp),
        border = BorderStroke(1.dp, border),
    ) {
        Text(
            text = kind.shortTag,
            color = fg,
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
        )
    }
}

@Composable
fun KidChip(kidCode: String, showAvatar: Boolean = true, modifier: Modifier = Modifier) {
    val (bg, fg, border, label) = when (kidCode) {
        "Ale" -> listOf(PiotaColors.AleBg, PiotaColors.AleInk, PiotaColors.AleBorder, "Ale P3")
        "Seb", "Seby" -> listOf(PiotaColors.SebBg, PiotaColors.SebInk, PiotaColors.SebBorder, "Seby P1")
        else -> listOf(PiotaColors.BothBg, PiotaColors.BothInk, PiotaColors.BothBorder, "Ale + Seby")
    }
    Surface(
        modifier = modifier,
        color = bg as Color,
        shape = RoundedCornerShape(999.dp),
        border = BorderStroke(1.dp, border as Color),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
        ) {
            if (showAvatar && (kidCode == "Ale" || kidCode == "Seb" || kidCode == "Seby")) {
                KidAvatarCircle(kidCode = kidCode, size = 16.dp)
            }
            Text(
                text = label as String,
                color = fg as Color,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
            )
        }
    }
}

@Composable
fun KidAvatarCircle(kidCode: String, size: Dp = 24.dp, modifier: Modifier = Modifier) {
    val res = if (kidCode == "Ale") R.drawable.avatar_ale else R.drawable.avatar_sebi
    val ring = if (kidCode == "Ale") PiotaColors.AleInk else PiotaColors.SebInk
    Image(
        painter = painterResource(id = res),
        contentDescription = kidCode,
        contentScale = ContentScale.Crop,
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .border(1.5.dp, ring, CircleShape),
    )
}

@Composable
fun KidSegmentedBar(
    selected: KidFilter,
    onSelect: (KidFilter) -> Unit,
    aleCount: Int? = null,
    sebCount: Int? = null,
    modifier: Modifier = Modifier,
) {
    Surface(
        modifier = modifier.fillMaxWidth(),
        color = PiotaColors.SurfaceMuted,
        shape = RoundedCornerShape(8.dp),
        border = BorderStroke(1.dp, PiotaColors.BorderStrong),
    ) {
        Row(
            modifier = Modifier.padding(3.dp),
            horizontalArrangement = Arrangement.spacedBy(3.dp),
        ) {
            KidFilter.entries.forEach { kf ->
                val isSel = kf == selected
                val countSuffix = when (kf) {
                    KidFilter.ALE -> aleCount?.let { " ($it)" } ?: ""
                    KidFilter.SEB -> sebCount?.let { " ($it)" } ?: ""
                    KidFilter.ALL -> ""
                }
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(6.dp))
                        .background(if (isSel) PiotaColors.Ink else Color.Transparent)
                        .clickable { onSelect(kf) }
                        .padding(vertical = 7.dp),
                ) {
                    Text(
                        text = "${kf.label}$countSuffix",
                        color = if (isSel) Color.White else PiotaColors.Slate,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
        }
    }
}

fun formatShortDateIt(isoDate: String): String {
    if (isoDate.length < 10) return isoDate
    return try {
        val d = java.time.LocalDate.parse(isoDate.take(10))
        val wds = listOf("Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom")
        val mons = listOf("Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic")
        "${wds[d.dayOfWeek.value - 1]} ${String.format("%02d", d.dayOfMonth)} ${mons[d.monthValue - 1]}"
    } catch (_: Exception) {
        isoDate.take(10)
    }
}

@Composable
fun MonoDateText(text: String, modifier: Modifier = Modifier, color: Color = PiotaColors.Muted) {
    Text(
        text = text,
        color = color,
        fontFamily = FontFamily.Monospace,
        fontSize = 11.sp,
        fontWeight = FontWeight.SemiBold,
        modifier = modifier,
    )
}
