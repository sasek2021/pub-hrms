// src/services/attendanceService.js

import axios from 'axios';
import { fetchDataFromLocalStorage } from '../utils/FetchDataFromLocalStorage';

const API_URL = `${process.env.REACT_APP_API_URL}/api/attendance`;

// Generic axios instance with default settings
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use((config) => {
    const user = fetchDataFromLocalStorage('userActive');
    if (user?.api_token) {
        config.headers.Authorization = `Bearer ${user?.api_token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// Fetch attendance
export const getAttendance = async () => {
    try {
        const response = await axiosInstance.get('/');
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error fetching attendance:`, error);
        throw error;
    }
};

// Fetch attendance by ID
export const getAttendanceByID = async (id) => {
    try {
        const response = await axiosInstance.get(`/${id}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error fetching attendance ${id}:`, error);
        throw error;
    }
};

// Create add attendance
export const createAttendance = async (data) => {
    try {
        const response = await axiosInstance.post('/add', data);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error creating attendance:", error);
        throw error;
    }
};

// Create clock-in attendance
export const clockInAttendance = async (data) => {
    try {
        const response = await axiosInstance.post('/clock-in', data);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error clock in:", error);
        throw error;
    }
};

// Create clock-out attendance
export const clockOutAttendance = async (data) => {
    try {
        const response = await axiosInstance.post('/clock-out', data);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error clock out:", error);
        throw error;
    }
};

// Delete an attendance by ID
export const deleteAttendanceByID = async (id) => {
    try {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error deleting attendance with ID ${id}:`, error);
        throw error;
    }
};
