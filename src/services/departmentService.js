// src/service/departmentService.js

import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/departments`;

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

// Fetch all departments
export const getDepartments = async () => {
    try {
        const response = await axiosInstance.get('/');
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error fetching departments:", error);
        throw error;
    }
};

// Fetch a single department by ID
export const getDepartmentByID = async (departmentId) => {
    try {
        const response = await axiosInstance.get(`/${departmentId}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error fetching department with ID ${departmentId}:`, error);
        throw error;
    }
};

// Fetch a single department by ID
export const getDepartmentBySlug = async (slug) => {
    try {
        const response = await axiosInstance.get(`/slug/${slug}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 404) {
            // Redirect to the pagenotfound page
            window.location.href = '/pagenotfound';
        }           
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error fetching department with ID ${slug}:`, error);
        throw error;
    }
};

// Delete a department by ID
export const deleteDepartmentByID = async (departmentId) => {
    try {
        const response = await axiosInstance.delete(`/${departmentId}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error deleting department with ID ${departmentId}:`, error);
        throw error;
    }
};

// Update a department by ID
export const updateDepartmentByID = async (departmentId, departmentData) => {
    try {
        const response = await axiosInstance.put(`/${departmentId}`, departmentData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error updating department with ID ${departmentId}:`, error);
        throw error;
    }
};

// Create a new department
export const createDepartment = async (departmentData) => {
    try {
        const response = await axiosInstance.post('/', departmentData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error creating department:", error);
        throw error;
    }
};
