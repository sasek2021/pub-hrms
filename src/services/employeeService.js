// src/employee/employeeService.js

import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/employees`;

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

// Fetch all employees
export const getEmployees = async () => {
    try {
        const response = await axiosInstance.get('/');
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error fetching employees:", error);
        throw error;
    }
};

// Fetch a single employee by ID
export const getEmployeeByID = async (employeeId) => {
    try {
        const response = await axiosInstance.get(`/${employeeId}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error fetching employee with ID ${employeeId}:`, error);
        throw error;
    }
};

// Delete an employee by ID
export const deleteEmployeeByID = async (employeeId) => {
    try {
        const response = await axiosInstance.delete(`/${employeeId}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error deleting employee with ID ${employeeId}:`, error);
        throw error;
    }
};

// Update an employee by ID
export const updateEmployeeByID = async (employeeId, employeeData) => {
    try {
        const response = await axiosInstance.put(`/${employeeId}`, employeeData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error updating employee with ID ${employeeId}:`, error);
        throw error;
    }
};

// Create a new employee
export const createEmployee = async (employeeData) => {
    try {
        const response = await axiosInstance.post('/', employeeData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error creating employee:", error);
        throw error;
    }
};
