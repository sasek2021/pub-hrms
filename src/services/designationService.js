// src/services/designationService.js

import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/designations`;

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

// Fetch all designation
export const getDesignations = async () => {
    try {
        const response = await axiosInstance.get('/');
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error fetching Designation:", error);
        throw error;
    }
};

// Fetch a single Designation by ID
export const getDesignationByID = async (id) => {
    try {
        const response = await axiosInstance.get(`/${id}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error fetching Designation with ID ${id}:`, error);
        throw error;
    }
};

// Delete an designation by ID
export const deleteDesignationByID = async (id) => {
    try {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error deleting Designation with ID ${id}:`, error);
        throw error;
    }
};

// Update an Designation by ID
export const updateDesignationByID = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/${id}`, data);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error updating employee with ID ${id}:`, error);
        throw error;
    }
};

// Create a new Designation
export const createDesignation = async (data) => {
    try {
        const response = await axiosInstance.post('/', data);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error creating Designation:", error);
        throw error;
    }
};
