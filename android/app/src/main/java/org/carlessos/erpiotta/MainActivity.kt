package org.carlessos.erpiotta

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Inbox
import androidx.compose.material.icons.outlined.PhotoLibrary
import androidx.compose.material.icons.outlined.Refresh
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import kotlinx.coroutines.launch
import org.carlessos.erpiotta.data.KidFilter
import org.carlessos.erpiotta.data.PiotaRepository
import org.carlessos.erpiotta.ui.navigation.ErPiottaNavState
import org.carlessos.erpiotta.ui.navigation.PiotaTab
import org.carlessos.erpiotta.ui.screens.HomeScreen
import org.carlessos.erpiotta.ui.screens.ItemDetailScreen
import org.carlessos.erpiotta.ui.screens.NewsInboxScreen
import org.carlessos.erpiotta.ui.screens.PhotosAndLogsScreen
import org.carlessos.erpiotta.ui.screens.QuickLogSheetContent
import org.carlessos.erpiotta.ui.screens.TodoScreen
import org.carlessos.erpiotta.ui.screens.WeeklyCalendarScreen
import org.carlessos.erpiotta.ui.theme.ErPiottaTheme
import org.carlessos.erpiotta.ui.theme.PiotaColors
import java.time.Instant
import java.time.temporal.ChronoUnit

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val repo = PiotaRepository(applicationContext)
        setContent {
            ErPiottaTheme {
                ErPiottaApp(repo = repo)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ErPiottaApp(repo: PiotaRepository) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val snackbar = remember { SnackbarHostState() }

    var items by remember { mutableStateOf(repo.loadOfflineFeed()) }
    var logs by remember { mutableStateOf(repo.loadLocalLogs()) }
    val photos = remember(items) { repo.extractPhotoAlbums(items) }

    var navState by remember { mutableStateOf(ErPiottaNavState()) }
    var kidFilter by remember { mutableStateOf(KidFilter.ALL) }
    var isSyncing by remember { mutableStateOf(false) }
    var showIconLightbox by remember { mutableStateOf(false) }

    // Intercept system Back gesture/button whenever inside a detail screen, modal sheet, or non-root tab!
    BackHandler(enabled = navState.canNavigateBack) {
        navState = navState.handleBack().first
    }

    fun openExternalUrl(url: String) {
        if (url.isBlank()) return
        try {
            context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
        } catch (_: Exception) {
        }
    }

    fun refreshFromServer(showToast: Boolean) {
        scope.launch {
            isSyncing = true
            val synced = repo.syncFromServer()
            isSyncing = false
            if (synced != null) {
                items = synced.first
                logs = synced.second
                if (showToast) snackbar.showSnackbar("Sincronizzato con Er Piotta (${items.size} elementi)")
            } else if (showToast) {
                snackbar.showSnackbar("Modalità offline: uso dati locali in cache")
            }
        }
    }

    LaunchedEffect(Unit) {
        refreshFromServer(showToast = false)
    }

    val currentDetail = navState.openedItem
    if (currentDetail != null) {
        ItemDetailScreen(
            item = currentDetail,
            onBack = { navState = navState.closeDetail() },
            onArchive = {
                repo.updateItemOverride(currentDetail.id, archived = true, snoozedUntil = "")
                items = items.map { if (it.id == currentDetail.id) it.copy(isArchived = true, snoozedUntil = "") else it }
                scope.launch { repo.pushTicketPatchToServer(currentDetail.id, archived = true, snoozedUntil = "") }
                navState = navState.closeDetail()
            },
            onSnooze7d = {
                val until = Instant.now().plus(7, ChronoUnit.DAYS).toString()
                repo.updateItemOverride(currentDetail.id, archived = false, snoozedUntil = until)
                items = items.map { if (it.id == currentDetail.id) it.copy(isArchived = false, snoozedUntil = until) else it }
                scope.launch { repo.pushTicketPatchToServer(currentDetail.id, archived = false, snoozedUntil = until) }
                navState = navState.closeDetail()
            },
            onSaveNote = { newNote ->
                repo.updateItemOverride(currentDetail.id, note = newNote)
                items = items.map { if (it.id == currentDetail.id) it.copy(note = newNote) else it }
                navState = navState.openDetail(currentDetail.copy(note = newNote))
                scope.launch { repo.pushTicketPatchToServer(currentDetail.id, note = newNote) }
            },
            onOpenExternalUrl = ::openExternalUrl,
        )
        return
    }

    Scaffold(
        containerColor = PiotaColors.Canvas,
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = {
            Column {
                TopAppBar(
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = PiotaColors.Surface),
                    title = {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.er_piotta_icon),
                                contentDescription = "Apri icona Er Piotta a schermo intero",
                                contentScale = ContentScale.Crop,
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(RoundedCornerShape(9.dp))
                                    .clickable { showIconLightbox = true },
                            )
                            Column {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                ) {
                                    Text(
                                        text = "Er Piotta",
                                        fontSize = 17.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = PiotaColors.Ink,
                                    )
                                    Text(
                                        text = "v${BuildConfig.VERSION_NAME}",
                                        fontSize = 11.5.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = PiotaColors.Muted,
                                    )
                                }
                                Text(
                                    text = "Tandem IMS · Ale P3 & Seby P1",
                                    fontSize = 11.sp,
                                    color = PiotaColors.Muted,
                                )
                            }
                        }
                    },
                    actions = {
                        IconButton(onClick = { refreshFromServer(showToast = true) }, enabled = !isSyncing) {
                            Icon(
                                imageVector = Icons.Outlined.Refresh,
                                contentDescription = "Sincronizza",
                                tint = PiotaColors.Ink,
                            )
                        }
                    },
                )
                HorizontalDivider(color = PiotaColors.Border)
            }
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { navState = navState.openQuickLog(if (kidFilter == KidFilter.SEB) "Seby" else "Ale") },
                containerColor = PiotaColors.Ink,
                contentColor = Color.White,
                shape = RoundedCornerShape(14.dp),
            ) {
                Icon(Icons.Outlined.Add, contentDescription = "Nuovo Log")
            }
        },
        bottomBar = {
            Surface(color = PiotaColors.Surface) {
                Column(modifier = Modifier.navigationBarsPadding()) {
                    HorizontalDivider(color = PiotaColors.Border)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 18.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp, Alignment.CenterHorizontally),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        CompactColorNavItem(
                            label = "Home",
                            icon = Icons.Outlined.Home,
                            selected = navState.activeTab == PiotaTab.HOME,
                            activeColor = Color(0xFFE11D48),
                            pillBg = Color(0xFFFFE4E6),
                            idleColor = Color(0xFFFB7185),
                            onClick = { navState = navState.selectTab(PiotaTab.HOME) },
                            modifier = Modifier.weight(1f),
                        )
                        CompactColorNavItem(
                            label = "TODO",
                            icon = Icons.Outlined.CheckCircle,
                            selected = navState.activeTab == PiotaTab.TODO,
                            activeColor = Color(0xFF1D4ED8),
                            pillBg = Color(0xFFDBEAFE),
                            idleColor = Color(0xFF60A5FA),
                            onClick = { navState = navState.selectTab(PiotaTab.TODO) },
                            modifier = Modifier.weight(1f),
                        )
                        CompactColorNavItem(
                            label = "Novità",
                            icon = Icons.Outlined.Inbox,
                            selected = navState.activeTab == PiotaTab.NEWS,
                            activeColor = Color(0xFFD97706),
                            pillBg = Color(0xFFFEF3C7),
                            idleColor = Color(0xFFF59E0B),
                            onClick = { navState = navState.selectTab(PiotaTab.NEWS) },
                            modifier = Modifier.weight(1f),
                        )
                        CompactColorNavItem(
                            label = "Cal",
                            icon = Icons.Outlined.CalendarMonth,
                            selected = navState.activeTab == PiotaTab.CALENDAR,
                            activeColor = Color(0xFF059669),
                            pillBg = Color(0xFFD1FAE5),
                            idleColor = Color(0xFF34D399),
                            onClick = { navState = navState.selectTab(PiotaTab.CALENDAR) },
                            modifier = Modifier.weight(1f),
                        )
                        CompactColorNavItem(
                            label = "Log",
                            icon = Icons.Outlined.PhotoLibrary,
                            selected = navState.activeTab == PiotaTab.LOGS_AND_PHOTOS,
                            activeColor = Color(0xFF7C3AED),
                            pillBg = Color(0xFFEDE9FE),
                            idleColor = Color(0xFFA78BFA),
                            onClick = { navState = navState.selectTab(PiotaTab.LOGS_AND_PHOTOS) },
                            modifier = Modifier.weight(1f),
                        )
                    }
                }
            }
        },
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
        ) {
            when (navState.activeTab) {
                PiotaTab.HOME -> HomeScreen(
                    items = items,
                    onOpenAle = {
                        kidFilter = KidFilter.ALE
                        navState = navState.selectTab(PiotaTab.TODO)
                    },
                    onOpenSeby = {
                        kidFilter = KidFilter.SEB
                        navState = navState.selectTab(PiotaTab.TODO)
                    },
                    onOpenRiccardo = {
                        kidFilter = KidFilter.ALL
                        navState = navState.selectTab(PiotaTab.NEWS)
                    },
                    onOpenItem = { item ->
                        navState = navState.openDetail(item)
                    },
                )

                PiotaTab.TODO -> TodoScreen(
                    items = items,
                    recentLogs = logs,
                    kidFilter = kidFilter,
                    onKidFilterChange = { kidFilter = it },
                    onOpenItem = { navState = navState.openDetail(it) },
                    onArchiveItem = { target ->
                        repo.updateItemOverride(target.id, archived = true, snoozedUntil = "")
                        items = items.map { if (it.id == target.id) it.copy(isArchived = true) else it }
                        scope.launch { repo.pushTicketPatchToServer(target.id, archived = true, snoozedUntil = "") }
                    },
                    onOpenQuickLog = { kid -> navState = navState.openQuickLog(kid) },
                )

                PiotaTab.NEWS -> NewsInboxScreen(
                    items = items,
                    kidFilter = kidFilter,
                    onKidFilterChange = { kidFilter = it },
                    onOpenItem = { navState = navState.openDetail(it) },
                )

                PiotaTab.CALENDAR -> WeeklyCalendarScreen(
                    items = items,
                    kidFilter = kidFilter,
                    onKidFilterChange = { kidFilter = it },
                    onOpenItem = { navState = navState.openDetail(it) },
                )

                PiotaTab.LOGS_AND_PHOTOS -> PhotosAndLogsScreen(
                    photos = photos,
                    logs = logs,
                    onOpenUrl = ::openExternalUrl,
                    onAddNewLog = { navState = navState.openQuickLog("Ale") },
                )
            }
        }
    }

    if (showIconLightbox) {
        Dialog(
            onDismissRequest = { showIconLightbox = false },
            properties = DialogProperties(usePlatformDefaultWidth = false),
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.90f))
                    .clickable { showIconLightbox = false }
                    .padding(20.dp),
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.er_piotta_icon),
                        contentDescription = "Er Piotta — Riccardo DJ, Ale & Seby",
                        contentScale = ContentScale.Fit,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(24.dp)),
                    )
                    Text(
                        text = "Er Piotta v${BuildConfig.VERSION_NAME} · Riccardo DJ, Ale & Seby",
                        color = Color.White,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        text = "Tocca ovunque per chiudere",
                        color = Color.White.copy(alpha = 0.72f),
                        fontSize = 12.sp,
                    )
                }
            }
        }
    }

    val sheetKid = navState.quickLogKid
    if (sheetKid != null) {
        ModalBottomSheet(
            onDismissRequest = { navState = navState.closeQuickLog() },
            containerColor = PiotaColors.Surface,
        ) {
            QuickLogSheetContent(
                initialKid = sheetKid,
                onDismiss = { navState = navState.closeQuickLog() },
                onSave = { kid, topic, subtopic, text, score, syncSeptober ->
                    val entry = repo.newLogEntry(kid, topic, subtopic, text, score, "Riccardo", syncSeptober)
                    logs = repo.saveLocalLog(entry)
                    navState = navState.closeQuickLog()
                    scope.launch {
                        val pushed = repo.pushLogToServer(entry, syncSeptober)
                        snackbar.showSnackbar(
                            if (pushed) "Log salvato e sincronizzato!" else "Log salvato in locale (offline)"
                        )
                    }
                },
            )
        }
    }
}

@Composable
private fun CompactColorNavItem(
    label: String,
    icon: ImageVector,
    selected: Boolean,
    activeColor: Color,
    pillBg: Color,
    idleColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(2.dp),
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .clickable(onClick = onClick)
            .padding(vertical = 3.dp),
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .clip(RoundedCornerShape(999.dp))
                .background(if (selected) pillBg else Color.Transparent)
                .padding(horizontal = 12.dp, vertical = 4.dp),
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = if (selected) activeColor else idleColor,
                modifier = Modifier.size(21.dp),
            )
        }
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
            color = if (selected) activeColor else PiotaColors.Muted,
            maxLines = 1,
        )
    }
}
