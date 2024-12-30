/**
 * Converts an ISO date string to 12-hour time format with AM/PM.
 *
 * @param {string} isoDate - The ISO date string (e.g., "2024-11-25T04:10:17.561Z").
 * @returns {string} The formatted time in 12-hour format (e.g., "4:10 AM").
 */
const formatDateTo12HourTime = (isoDate) => {
    if (!isoDate) return "Invalid Date";

    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return "Invalid Date";

        const hours = date.getHours();
        const minutes = date.getMinutes();

        const period = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight

        return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
    } catch (error) {
        return "Invalid Date";
    }
};


// Exporting the function for use in other modules
module.exports = { formatDateTo12HourTime };
