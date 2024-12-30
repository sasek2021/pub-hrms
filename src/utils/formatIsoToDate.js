/**
 * Converts an ISO date string to a YYYY-MM-DD format.
 *
 * @param {string} isoDate - The ISO date string (e.g., "2024-11-25T04:10:17.561Z").
 * @returns {string} The formatted date in YYYY-MM-DD format (e.g., "2024-11-24").
 */
const formatIsoToDate = (isoDate) => {
    if (!isoDate) return "Invalid Date";

    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return "Invalid Date";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    } catch (error) {
        return "Invalid Date";
    }
};



// Exporting the function for use in other modules
module.exports = { formatIsoToDate };
