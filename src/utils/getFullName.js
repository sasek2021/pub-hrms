/**
 * Generates a full name from the given firstName and lastName.
 * If one of the names is missing, it returns the available name.
 *
 * @param {string} firstName - The first name of the person.
 * @param {string} lastName - The last name of the person.
 * @returns {string} The full name or the available name.
 */
const getFullName = (obj={first_name:'', last_name:''}) => {
    if (!obj?.last_name && !obj?.last_name) return "Unknown";
    if (!obj?.first_name) return obj?.first_name;
    if (!obj?.last_name) return obj?.last_name;
    return `${obj?.last_name} ${obj?.first_name}`;
};


// Exporting the function for use in other modules
module.exports = { getFullName };
