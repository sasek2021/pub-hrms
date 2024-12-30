// HR.js

import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import '../styles/HR.css'; // Create a CSS file for styling
import { FaUsers, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';

const HR = () => {
    return (
        <div className="hr-container">
            <h2>HR Dashboard</h2>
            <div className="hr-links">
                <Link to="/hr/employees" className="hr-link">
                    <FaUsers style={{ marginRight: '8px' }} />
                    Employees
                </Link>
                <Link to="/hr/candidates" className="hr-link">
                    <FaClipboardList style={{ marginRight: '8px' }} />
                    Candidates
                </Link>
                <Link to="/hr/payroll" className="hr-link">
                    <FaMoneyBillWave style={{ marginRight: '8px' }} />
                    Payroll
                </Link>
            </div>
        </div>
    );
};

export default HR;
