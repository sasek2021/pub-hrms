/**
 * Converts a given time string to 12-hour format with AM/PM.
 *
 * @param {string} time24h - The time string in 24-hour format (e.g., "14:30", "09:15").
 * @returns {string} The time in 12-hour format with AM/PM (e.g., "2:30 PM", "9:15 AM").
 */

export const formatTimeTo12Hour = (time24h) => {
    if (!time24h) return "Invalid Time";

    const [hours, minutes] = time24h.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return "Invalid Time";

    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight

    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

// Exporting the function for use in other modules
module.exports = { formatTimeTo12Hour };
