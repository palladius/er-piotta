package org.carlessos.erpiotta.ui.navigation

import org.carlessos.erpiotta.data.PiotaItem

enum class PiotaTab(val index: Int, val label: String) {
    HOME(0, "Home"),
    TODO(1, "TODO"),
    NEWS(2, "Novità"),
    CALENDAR(3, "Calendario"),
    LOGS_AND_PHOTOS(4, "Log & Foto"),
}

data class ErPiottaNavState(
    val activeTab: PiotaTab = PiotaTab.HOME,
    val openedItem: PiotaItem? = null,
    val quickLogKid: String? = null,
) {
    /** True whenever pressing system Back must be handled inside the app rather than minimizing it. */
    val canNavigateBack: Boolean
        get() = quickLogKid != null || openedItem != null || activeTab != PiotaTab.HOME

    fun selectTab(tab: PiotaTab): ErPiottaNavState = copy(
        activeTab = tab,
        openedItem = null,
    )

    fun openDetail(item: PiotaItem): ErPiottaNavState = copy(
        openedItem = item,
        quickLogKid = null,
    )

    fun closeDetail(): ErPiottaNavState = copy(openedItem = null)

    fun openQuickLog(kid: String): ErPiottaNavState = copy(quickLogKid = kid)

    fun closeQuickLog(): ErPiottaNavState = copy(quickLogKid = null)

    /**
     * Deterministic back-navigation reducer:
     * 1. Dismiss QuickLog modal sheet if open
     * 2. Close ItemDetail screen if open (returns to activeTab)
     * 3. Return to root HOME synopsis tab if currently on another tab
     * 4. Otherwise returns handled = false (allow OS to exit/minimize)
     */
    fun handleBack(): Pair<ErPiottaNavState, Boolean> = when {
        quickLogKid != null -> copy(quickLogKid = null) to true
        openedItem != null -> copy(openedItem = null) to true
        activeTab != PiotaTab.HOME -> copy(activeTab = PiotaTab.HOME) to true
        else -> this to false
    }
}
