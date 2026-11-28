package org.carlessos.erpiotta.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

object PiotaColors {
    val Ink = Color(0xFF0F172A)
    val Slate = Color(0xFF475569)
    val Muted = Color(0xFF64748B)
    val Border = Color(0xFFE2E8F0)
    val BorderStrong = Color(0xFFCBD5E1)
    val Surface = Color(0xFFFFFFFF)
    val SurfaceMuted = Color(0xFFF8FAFC)
    val Canvas = Color(0xFFF1F5F9)

    // Kid accents (soft, tasteful)
    val AleBg = Color(0xFFEFF6FF)
    val AleBorder = Color(0xFFBFDBFE)
    val AleInk = Color(0xFF1D4ED8)

    val SebBg = Color(0xFFF0FDF4)
    val SebBorder = Color(0xFFBBF7D0)
    val SebInk = Color(0xFF166534)

    val BothBg = Color(0xFFF5F3FF)
    val BothBorder = Color(0xFFDDD6FE)
    val BothInk = Color(0xFF6D28D9)

    // Provenance accents
    val EmailBg = Color(0xFFEFF6FF)
    val EmailInk = Color(0xFF1D4ED8)
    val GCalBg = Color(0xFFF0FDF4)
    val GCalInk = Color(0xFF166534)
    val WhatsAppBg = Color(0xFFECFDF5)
    val WhatsAppInk = Color(0xFF047857)
    val AiBg = Color(0xFFF5F3FF)
    val AiInk = Color(0xFF6D28D9)
    val LegacyBg = Color(0xFFF1F5F9)
    val LegacyInk = Color(0xFF475569)

    // Semantic accents
    val TestAccent = Color(0xFFDC2626)
    val TestBg = Color(0xFFFEF2F2)
    val HwAccent = Color(0xFFD97706)
    val HwBg = Color(0xFFFFFBEB)
    val EventAccent = Color(0xFF059669)
    val EventBg = Color(0xFFECFDF5)
}

private val PiotaLightScheme = lightColorScheme(
    primary = PiotaColors.Ink,
    onPrimary = Color.White,
    secondary = PiotaColors.AleInk,
    onSecondary = Color.White,
    tertiary = PiotaColors.AiInk,
    background = PiotaColors.Canvas,
    onBackground = PiotaColors.Ink,
    surface = PiotaColors.Surface,
    onSurface = PiotaColors.Ink,
    surfaceVariant = PiotaColors.SurfaceMuted,
    onSurfaceVariant = PiotaColors.Slate,
    outline = PiotaColors.Border,
    outlineVariant = PiotaColors.BorderStrong,
)

private val PiotaTypography = Typography(
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
        letterSpacing = (-0.3).sp,
    ),
    titleMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 15.sp,
        lineHeight = 20.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp,
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.Bold,
        fontSize = 10.sp,
        lineHeight = 14.sp,
        letterSpacing = 0.3.sp,
    ),
)

@Composable
fun ErPiottaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = PiotaLightScheme,
        typography = PiotaTypography,
        content = content,
    )
}
