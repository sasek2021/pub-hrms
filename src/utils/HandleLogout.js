
// Utility function to handle logout
const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
};

// Exporting the function for use in other modules
module.exports = { handleLogout };