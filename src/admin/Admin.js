// Admin.js

import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import '../styles/Admin.css'; // Create a CSS file for styling
import { FaUserShield, FaCogs, FaUsersCog } from 'react-icons/fa';

const Admin = () => {
    return (
        <div className="admin-container">
            <h2>Admin Dashboard</h2>
            <div className="admin-links">
                <Link to="/admin/users" className="admin-link">
                    <FaUsersCog style={{ marginRight: '8px' }} />
                    User Management
                </Link>
                <Link to="/admin/settings" className="admin-link">
                    <FaCogs style={{ marginRight: '8px' }} />
                    Site Settings
                </Link>
                <Link to="/admin/permissions" className="admin-link">
                    <FaUserShield style={{ marginRight: '8px' }} />
                    Permissions
                </Link>
            </div>
        </div>
    );
};

export default Admin;
