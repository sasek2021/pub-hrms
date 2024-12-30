// src/components/EmployeeList.js
import React, { useEffect, useState } from 'react';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch('http://localhost:3000/api/employees');
            // const response = await fetch('https://api-hrms-three.vercel.app/api/employees');
            const data = await response.json();
            console.log('Data>>>', data);
            setEmployees(data);
        };

        fetchEmployees();
    }, []);

    return (
        <div>
            <h1>Employee List</h1>
            <ul>
                {employees.map(employee => (
                    <li key={employee._id}>{employee.name} - {employee.position}</li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;