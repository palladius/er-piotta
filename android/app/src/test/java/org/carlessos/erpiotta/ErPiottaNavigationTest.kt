package org.carlessos.erpiotta

import org.carlessos.erpiotta.data.PreviewFixtures
import org.carlessos.erpiotta.ui.navigation.ErPiottaNavState
import org.carlessos.erpiotta.ui.navigation.PiotaTab
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ErPiottaNavigationTest {

    @Test
    fun enteringAndExitingHomeworkNoteDoesNotMinimizeApp() {
        val hw = PreviewFixtures.sampleItems.first()
        val initial = ErPiottaNavState(activeTab = PiotaTab.CALENDAR)
        val insideDetail = initial.openDetail(hw)

        assertTrue(insideDetail.canNavigateBack)
        assertEquals(hw, insideDetail.openedItem)

        val (afterBack, handled) = insideDetail.handleBack()
        assertTrue(handled)
        assertNull(afterBack.openedItem)
        assertEquals(PiotaTab.CALENDAR, afterBack.activeTab)
    }

    @Test
    fun backFromQuickLogSheetDismissesSheetWithoutLeavingCurrentTab() {
        val state = ErPiottaNavState(activeTab = PiotaTab.NEWS).openQuickLog("Ale")
        assertTrue(state.canNavigateBack)
        assertEquals("Ale", state.quickLogKid)

        val (afterBack, handled) = state.handleBack()
        assertTrue(handled)
        assertNull(afterBack.quickLogKid)
        assertEquals(PiotaTab.NEWS, afterBack.activeTab)
    }

    @Test
    fun backFromNonHomeTabReturnsToHomeSynopsisBeforeAllowingAppExit() {
        val onCalendar = ErPiottaNavState(activeTab = PiotaTab.CALENDAR)
        assertTrue(onCalendar.canNavigateBack)

        val (afterFirstBack, handledFirst) = onCalendar.handleBack()
        assertTrue(handledFirst)
        assertEquals(PiotaTab.HOME, afterFirstBack.activeTab)
        assertFalse(afterFirstBack.canNavigateBack)

        // Only on root HOME tab with no detail/sheet open may OS exit
        val (_, handledSecond) = afterFirstBack.handleBack()
        assertFalse(handledSecond)
    }

    @Test
    fun explicitTopBarBackButtonClosesDetailAndPreservesTab() {
        val hw = PreviewFixtures.sampleItems[1]
        val state = ErPiottaNavState(activeTab = PiotaTab.TODO).openDetail(hw)
        val closed = state.closeDetail()

        assertNull(closed.openedItem)
        assertEquals(PiotaTab.TODO, closed.activeTab)
    }
}
