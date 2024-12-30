// src/services/branchService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/branches`;

// Function to get the authorization token
const getAuthToken = () => {
    return JSON.parse(localStorage.getItem('userActive'));
};

// Generic axios instance with default settings
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use((config) => {
    const user = getAuthToken();
    if (user?.api_token) {
        config.headers.Authorization = `Bearer ${user?.api_token}`;
    }
    return config;
}, (error) => {  
    return Promise.reject(error);
});

// Create a new branch
export const createBranch = async (branchData) => {
    try {
        const response = await axiosInstance.post('', branchData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error creating branch:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Update a branch by ID
export const updateBranchByID = async (branchID, branchData) => {
    try {
        const response = await axiosInstance.put(`/${branchID}`, branchData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error updating company with ID ${branchID}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};
