// src/services/companyService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/companies`;

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

// Fetch all companies
// export const getCompanies = async () => {
//     try {
//         const response = await axiosInstance.get();
//         return response.data;
//     } catch (error) {
//         // Check if the error is due to an unauthorized status (401)
//         if (error.response && error.response.status === 401) {
//             // Redirect to the login page
//             window.location.href = '/login';
//         }          
//         console.error("Error fetching companies:", error.response ? error.response.data : error.message);
//         throw error;
//     }
// };
export const getCompanies = async (type) => {
    try {
        const query = type ? `?type=${encodeURIComponent(type)}` : '';
        const response = await axiosInstance.get(query); // Specify the endpoint
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }
        console.error("Error fetching companies:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Fetch a single company by ID
export const getCompanyByID = async (companyId) => {
    try {
        const response = await axiosInstance.get(`/${companyId}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }          
        console.error(`Error fetching company with ID ${companyId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// Delete a company by ID
export const deleteCompanyByID = async (companyId) => {
    try {
        const response = await axiosInstance.delete(`/${companyId}`);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error deleting company with ID ${companyId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// Update a company by ID
export const updateCompanyByID = async (companyId, companyData) => {
    try {
        const response = await axiosInstance.put(`/${companyId}`, companyData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error(`Error updating company with ID ${companyId}:`, error.response ? error.response.data : error.message);
        throw error;
    }
};

// Create a new company
export const createCompany = async (companyData) => {
    try {
        const response = await axiosInstance.post('', companyData);
        return response.data;
    } catch (error) {
        // Check if the error is due to an unauthorized status (401)
        if (error.response && error.response.status === 401) {
            // Redirect to the login page
            window.location.href = '/login';
        }           
        console.error("Error creating company:", error.response ? error.response.data : error.message);
        throw error;
    }
};
