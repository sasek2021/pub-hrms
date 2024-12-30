// Reports.js

import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import '../styles/Reports.css'; // Create a CSS file for styling

const reportsData = [
    { id: 1, name: 'Monthly Sales Report', path: '/reports/sales' },
    { id: 2, name: 'Annual Performance Report', path: '/reports/performance' },
    { id: 3, name: 'Customer Feedback Report', path: '/reports/feedback' },
    { id: 4, name: 'Employee Performance Report', path: '/reports/employee' },
];

const Reports = () => {
    return (
        <div className="reports-container">
            <h2>Reports</h2>
            <ul className="reports-list">
                {reportsData.map((report) => (
                    <li key={report.id} className="report-item">
                        <Link to={report.path} className="report-link">
                            {report.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reports;
