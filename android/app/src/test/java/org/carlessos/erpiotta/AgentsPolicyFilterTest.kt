package org.carlessos.erpiotta

import org.carlessos.erpiotta.data.AgentsPolicyFilter
import org.carlessos.erpiotta.data.ProvenanceKind
import org.carlessos.erpiotta.data.RawFeedItem
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AgentsPolicyFilterTest {

    @Test
    fun dropsStaffGoodbyesAndWelcomes() {
        val raw = RawFeedItem(
            id = "alert_gmail_staff1",
            title = "Staff Goodbyes and Welcomes",
            body = "Dear Parents, here is a brief update on departing colleagues...",
        )
        assertTrue(AgentsPolicyFilter.shouldDropAsNoise(raw))
    }

    @Test
    fun dropsChristmasCardsWithoutPaymentButKeepsWithPayment() {
        val promoOnly = RawFeedItem(
            id = "alert_gmail_xmas1",
            title = "Our Tawang'a Christmas Cards Are Ready!",
            body = "We are so happy to share that the cards are ready.",
        )
        val withPayment = RawFeedItem(
            id = "alert_gmail_xmas2",
            title = "Tawang'a Christmas Cards - Ordering Link",
            body = "Please pay 5 CHF via the ordering link before Friday.",
        )
        assertTrue(AgentsPolicyFilter.shouldDropAsNoise(promoOnly))
        assertFalse(AgentsPolicyFilter.shouldDropAsNoise(withPayment))
    }

    @Test
    fun dropsOtherParentsPtcSlotsButKeepsCarlesso() {
        val other = RawFeedItem(
            id = "event_gcal_p1_ptc1",
            type = "event",
            title = "[P1 Seby] 1st Semester PTCs (Kate Halliday)",
        )
        val ours = RawFeedItem(
            id = "event_gcal_p1_ptc2",
            type = "event",
            title = "[P1 Seby] 1st Semester PTCs (Kate Carlesso Knight)",
        )
        assertTrue(AgentsPolicyFilter.shouldDropAsNoise(other))
        assertFalse(AgentsPolicyFilter.shouldDropAsNoise(ours))
    }

    @Test
    fun classifiesEmailProvenanceAndFormatsZurichTimestamp() {
        val raw = RawFeedItem(
            id = "alert_gmail_1a1f3885fe_schuhgroesse",
            type = "alert",
            title = "Schuhgrösse für Schlittschuhfahren",
            body = "**From:** Marvin Biehl <mbiehl@tandem-ims.ch>\n**Date:** Thu, 19 Nov 2026 12:18:24 +0100\n\nLiebe Eltern",
            createdAt = "2026-11-19T11:18:24Z",
            sourceUrl = "https://mail.google.com/mail/u/0/#inbox/1a1f3885fe",
            kidCode = "Ale",
        )
        val item = AgentsPolicyFilter.toPiotaItem(raw, "2026-11-27")
        assertEquals(ProvenanceKind.EMAIL, item.provenance)
        assertEquals("Marvin Biehl <mbiehl@tandem-ims.ch>", item.fromLine)
        assertEquals("20261119 12:18", item.timestampYmdHm)
    }
}
