// src/service/userService.js

import axios from 'axios';
import { handleLogout } from '../utils/HandleLogout';

// Define the base URL for the user API
const API_URL = `${process.env.REACT_APP_API_URL}/api/auth`;

// Function to get the authorization token
const getAuthToken = () => {
    return JSON.parse(localStorage.getItem('userActive'));
};

// Create a generic axios instance with default settings
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

// Fetch all users
export const getUsers = async () => {
    try {
        const response = await axiosInstance.get('/users');
        // Check if the user's status is 'Inactive'
        if (response.data.status === 'Inactive') {
            // Log out and redirect to login
            handleLogout();
            return; // Exit early as user is logged out
        }        
        return response.data;
    } catch (error) {
         // Check if the error is due to an unauthorized status (401)
         if (error.response && error.response.status === 401) {
            // Redirect to the login page
            handleLogout();
        }          
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Fetch a single user by ID
export const getUserByID = async (userId) => {
    try {
        const response = await axiosInstance.get(`/users/${userId}`);
        // Check if the user's status is 'Inactive'
        if (response.data.status === 'Inactive') {
            // Log out and redirect to login
            handleLogout();
            return; // Exit early as user is logged out
        }        
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            handleLogout();
        }           
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
    }
};

// Delete a user by ID
export const deleteUserByID = async (userId) => {
    try {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            handleLogout();
        }           
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error;
    }
};

// Update a user by ID
export const updateUserByID = async (userId, userData) => {
    try {
        const response = await axiosInstance.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            handleLogout();
        }           
        console.error(`Error updating user with ID ${userId}:`, error);
        throw error;
    }
};

// Create a new user
export const createUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/register', userData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            handleLogout();
        }           
        console.error("Error creating user:", error);
        throw error;
    }
};

// Change password for a user by ID
export const changePasswordUserByID = async (userId, userData) => {
    try {
        const response = await axiosInstance.put(`/users/${userId}/change-password`, userData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            handleLogout();
        }           
        console.error(`Error changing password for user with ID ${userId}:`, error);
        throw error;
    }
};

// Reset password via email for a user
export const resetUserPasswordViaGmail = async (userData) => {
    try {
        const response = await axiosInstance.post('/reset-password', userData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            handleLogout();
        }           
        console.error("Error resetting password for user:", error);
        throw error;
    }
};

// Confirm reset password for a user
export const confirmResetPassword = async (apiToken, userData) => {
    try {
        const response = await axiosInstance.post(`/reset-password/${apiToken}`, userData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            handleLogout();
        }           
        console.error("Error confirming password reset for user:", error);
        throw error;
    }
};