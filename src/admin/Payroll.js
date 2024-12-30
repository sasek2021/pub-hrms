// Payroll.js

import React, { useState } from 'react';
import { FaMoneyBillWave, FaPlusCircle } from 'react-icons/fa';
import '../styles/Payroll.css'; // Create a CSS file for styling

const Payroll = () => {
    const [payrollRecords, setPayrollRecords] = useState([]);
    const [newRecord, setNewRecord] = useState({
        employeeName: '',
        salary: '',
        date: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord({ ...newRecord, [name]: value });
    };

    const addPayrollRecord = (e) => {
        e.preventDefault();
        if (newRecord.employeeName && newRecord.salary && newRecord.date) {
            setPayrollRecords([...payrollRecords, newRecord]);
            setNewRecord({ employeeName: '', salary: '', date: '' });
        }
    };

    return (
        <div className="payroll-container">
            <h2>
                <FaMoneyBillWave style={{ marginRight: '8px' }} />
                Payroll Management
            </h2>
            <form onSubmit={addPayrollRecord} className="payroll-form">
                <input
                    type="text"
                    name="employeeName"
                    placeholder="Employee Name"
                    value={newRecord.employeeName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="salary"
                    placeholder="Salary"
                    value={newRecord.salary}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={newRecord.date}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">
                    <FaPlusCircle /> Add Record
                </button>
            </form>

            <div className="payroll-records">
                <h3>Payroll Records</h3>
                <ul>
                    {payrollRecords.map((record, index) => (
                        <li key={index}>
                            {record.employeeName} - ${record.salary} on {new Date(record.date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Payroll;
