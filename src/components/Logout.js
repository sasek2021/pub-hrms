import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Import the logout icon

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userActive'); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <Nav.Link as={Link} onClick={handleLogout} to="/login" className='d-flex align-items-center'>
            <FaSignOutAlt style={{ marginRight: '8px' }} /> Sign Out
        </Nav.Link>
    );
};

export default Logout;
