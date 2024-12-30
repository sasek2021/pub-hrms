// src/service/organizationService.js

import axios from 'axios';

// Define the base URL for the organizations API
const API_URL = `${process.env.REACT_APP_API_URL}/api/organizations`;

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

// Fetch all organizations
export const getOrganizations = async () => {
    try {
        const response = await axiosInstance.get('/');
        return response.data; // Assuming the data is in response.data
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error fetching organizations:", error);
        throw error;
    }
};

// Fetch a single organization by ID
export const getOrganizationByID = async (organizationId) => {
    try {
        const response = await axiosInstance.get(`/${organizationId}`);
        return response.data; // Assuming the data is in response.data
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error fetching organization with ID ${organizationId}:`, error);
        throw error;
    }
};

// Delete an organization by ID
export const deleteOrganizationByID = async (organizationId) => {
    try {
        const response = await axiosInstance.delete(`/${organizationId}`);
        return response.data; // Assuming the response indicates success
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error deleting organization with ID ${organizationId}:`, error);
        throw error;
    }
};

// Update an organization by ID
export const updateOrganizationByID = async (organizationId, organizationData) => {
    try {
        const response = await axiosInstance.put(`/${organizationId}`, organizationData);
        return response.data; // Assuming the updated data is returned
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error updating organization with ID ${organizationId}:`, error);
        throw error;
    }
};

// Create a new organization
export const createOrganization = async (organizationData) => {
    try {
        const response = await axiosInstance.post('/', organizationData);
        return response.data; // Assuming the newly created organization data is returned
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error creating organization:", error);
        throw error;
    }
};
