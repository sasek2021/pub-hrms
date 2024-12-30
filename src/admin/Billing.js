// Billing.js

import React, { useState } from 'react';
import { FaFileInvoiceDollar, FaPlusCircle } from 'react-icons/fa';
import '../styles/Billing.css'; // Optional: create a CSS file for styling

const Billing = () => {
    const [billingRecords, setBillingRecords] = useState([]);
    const [newRecord, setNewRecord] = useState({
        clientName: '',
        billingAmount: '',
        billingDate: '',
        description: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord({ ...newRecord, [name]: value });
    };

    const addBillingRecord = (e) => {
        e.preventDefault();
        if (newRecord.clientName && newRecord.billingAmount && newRecord.billingDate) {
            setBillingRecords([...billingRecords, newRecord]);
            setNewRecord({ clientName: '', billingAmount: '', billingDate: '', description: '' });
        }
    };

    const deleteBillingRecord = (index) => {
        const updatedRecords = billingRecords.filter((_, i) => i !== index);
        setBillingRecords(updatedRecords);
    };

    return (
        <div className="billing-container">
            <h2>
                <FaFileInvoiceDollar style={{ marginRight: '8px' }} />
                Billing Management
            </h2>

            <form onSubmit={addBillingRecord} className="billing-form">
                <input
                    type="text"
                    name="clientName"
                    placeholder="Client Name"
                    value={newRecord.clientName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="billingAmount"
                    placeholder="Amount"
                    value={newRecord.billingAmount}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="billingDate"
                    value={newRecord.billingDate}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description (optional)"
                    value={newRecord.description}
                    onChange={handleInputChange}
                />
                <button type="submit">
                    <FaPlusCircle /> Add Record
                </button>
            </form>

            <div className="billing-list">
                <h3>Billing Records</h3>
                <ul>
                    {billingRecords.map((record, index) => (
                        <li key={index}>
                            <span>{record.clientName} - ${record.billingAmount} on {new Date(record.billingDate).toLocaleDateString()}</span>
                            {record.description && <p>{record.description}</p>}
                            <button onClick={() => deleteBillingRecord(index)} className="delete-btn">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Billing;
