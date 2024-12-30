// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('userActive'));

    // If no token, redirect to login page
    if (!user?.api_token) {
        return <Navigate to="/login" />;
    }

    return children; // Render the protected component
};

export default ProtectedRoute;
