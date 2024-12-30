/**
 * Formats a phone number string by adding spaces or other separators
 * between the country code and the rest of the number based on country rules.
 * @param {string} phoneNumber - The phone number to format (e.g., '855969879554').
 * @returns {string} - The formatted phone number (e.g., '0 969 879 554').
 */
const formatPhoneNumber = (phoneNumber) => {
    // Check if the phone number is defined and has the correct length
    if (!phoneNumber || phoneNumber.length < 4) return ''; // Return empty if not valid

    // Define country formats
    const countryFormats = {
        '855': { // Cambodia
            pattern: /(\d{3})(\d{3})(\d+)/,
            separator: ' ',
            replaceCountryCode: true, // Replace country code with '0'
        },
        '84': { // Vietnam
            pattern: /(\d{3})(\d{3})(\d+)/,
            separator: ' ',
            replaceCountryCode: true, // Replace country code with '0'
        },
        '1': { // USA
            pattern: /(\d{3})(\d{3})(\d{4})/,
            format: '($1) $2-$3',
            replaceCountryCode: false, // Keep country code as is
        },
        '81': { // Japan
            pattern: /(\d{2})(\d{4})(\d{4})/,
            separator: '-',
            replaceCountryCode: false, // Keep country code as is
        },
        // Add other countries as needed...
    };

    // Extract the country code (up to 3 digits)
    const countryCode = phoneNumber.substring(0, 3);
    let localNumber = phoneNumber.substring(3);

    // Check if country code is defined in our formats
    const format = countryFormats[countryCode];
    if (!format) return phoneNumber; // If country code not found, return the original number

    // Format the local number based on the specified pattern
    const formattedLocalNumber = localNumber.replace(format.pattern, format.format || `$1${format.separator}$2${format.separator}$3`);

    // Return the formatted number, replacing the country code with '0' if applicable
    return `${format.replaceCountryCode ? '0' : countryCode} ${formattedLocalNumber}`; // e.g., '0 969 879 554'
};

// Exporting the function for use in other modules
module.exports = { formatPhoneNumber };
