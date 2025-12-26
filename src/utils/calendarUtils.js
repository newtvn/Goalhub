/**
 * Generates a Google Calendar Event URL for a given booking.
 * @param {Object} booking - The booking object containing details.
 * @returns {string} - The Google Calendar template URL.
 */
export const getGoogleCalendarUrl = (booking) => {
    if (!booking || !booking.date || !booking.time) return '#';
    try {
        // Create date objects (Assuming booking.date is YYYY-MM-DD and booking.time is HH:MM)
        // We treat the input date/time as local time by creating a Date object from it string concatenation
        const startDate = new Date(`${booking.date}T${booking.time}:00`);
        const endDate = new Date(startDate.getTime() + (booking.duration || 1) * 60 * 60 * 1000);

        // Format to YYYYMMDDTHHMMSSZ (UTC)
        const formatDate = (date) => {
            return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
        };

        const text = encodeURIComponent(`Football Match @ ${booking.turf}`);
        const details = encodeURIComponent(`Booking Ref: ${booking.id}\nLocation: GoalHub Kitengela\nExtras: ${booking.extras ? booking.extras.map(e => e.name).join(', ') : 'None'}`);
        const location = encodeURIComponent('GoalHub Kitengela');

        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${details}&location=${location}`;
    } catch (e) {
        console.error("Error generating calendar URL", e);
        return '#';
    }
};
