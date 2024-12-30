/**
 * Retrieves and parses a user object from localStorage by the given key.
 */
const fetchDataFromLocalStorage = (key="userActive") => {
    return JSON.parse(localStorage.getItem(key));
};

// Exporting the function for use in other modules
module.exports = { fetchDataFromLocalStorage };
