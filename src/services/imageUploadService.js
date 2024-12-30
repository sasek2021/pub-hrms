// src/services/companyService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/images`;

// Function to get the authorization token
const getAuthToken = () => {
    return JSON.parse(localStorage.getItem('userActive'));
};

// Generic axios instance with default settings
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data for file uploads
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

export const imageUpload = async (formData) => {
    try {
        const response = await axiosInstance.post('/upload', formData);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }           
        console.error("Error upload image:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Delete an image by imageName
export const deleteImage = async (imageName) => {
    try {
        const response = await axiosInstance.delete(`/delete-image/${imageName}`);
        console.log('response>>', response);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
        throw error;
    }
};
