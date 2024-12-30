// Invoices.js

import React, { useState } from 'react';
import { FaFileInvoice, FaPlusCircle } from 'react-icons/fa';
import '../styles/Invoices.css'; // Create a CSS file for styling

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [newInvoice, setNewInvoice] = useState({
        clientName: '',
        amount: '',
        date: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInvoice({ ...newInvoice, [name]: value });
    };

    const addInvoice = (e) => {
        e.preventDefault();
        if (newInvoice.clientName && newInvoice.amount && newInvoice.date) {
            setInvoices([...invoices, newInvoice]);
            setNewInvoice({ clientName: '', amount: '', date: '' });
        }
    };

    const deleteInvoice = (index) => {
        const updatedInvoices = invoices.filter((_, i) => i !== index);
        setInvoices(updatedInvoices);
    };

    return (
        <div className="invoices-container">
            <h2>
                <FaFileInvoice style={{ marginRight: '8px' }} />
                Invoices Management
            </h2>
            <form onSubmit={addInvoice} className="invoices-form">
                <input
                    type="text"
                    name="clientName"
                    placeholder="Client Name"
                    value={newInvoice.clientName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={newInvoice.amount}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={newInvoice.date}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">
                    <FaPlusCircle /> Add Invoice
                </button>
            </form>

            <div className="invoices-list">
                <h3>Invoice List</h3>
                <ul>
                    {invoices.map((invoice, index) => (
                        <li key={index}>
                            <span>{invoice.clientName} - ${invoice.amount} on {new Date(invoice.date).toLocaleDateString()}</span>
                            <button onClick={() => deleteInvoice(index)} className="delete-btn">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Invoices;
