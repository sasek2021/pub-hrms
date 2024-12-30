/**
 * @param {string} imageUrl - The phone number to format (e.g., 'http://localhost:3000/uploads/1731647688171.png').
 * @returns {string} - Output: "1731647688171.png".
 */
const getImageName = (imageUrl) => {
    // Extract the image name from the URL
    return imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
}

// Exporting the function for use in other modules
module.exports = { getImageName };
