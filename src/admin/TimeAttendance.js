// TimeAttendance.js

import React, { useState } from 'react';
import '../styles/TimeAttendance.css'; // You can create a CSS file for styling

const TimeAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [clockInTime, setClockInTime] = useState('');
    const [clockOutTime, setClockOutTime] = useState('');

    const handleClockIn = () => {
        const now = new Date();
        setClockInTime(now.toLocaleTimeString());
        setIsClockedIn(true);
    };

    const handleClockOut = () => {
        const now = new Date();
        setClockOutTime(now.toLocaleTimeString());
        setIsClockedIn(false);

        const record = {
            date: new Date().toLocaleDateString(),
            clockIn: clockInTime,
            clockOut: now.toLocaleTimeString(),
        };

        setAttendanceRecords([...attendanceRecords, record]);
        setClockInTime('');
        setClockOutTime('');
    };

    return (
        <div className="time-attendance-container">
            <h2>Time & Attendance</h2>
            <div className="clock-section">
                <button onClick={handleClockIn} disabled={isClockedIn}>
                    Clock In
                </button>
                <button onClick={handleClockOut} disabled={!isClockedIn}>
                    Clock Out
                </button>
            </div>

            <h3>Attendance Records</h3>
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map((record, index) => (
                        <tr key={index}>
                            <td>{record.date}</td>
                            <td>{record.clockIn}</td>
                            <td>{record.clockOut}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimeAttendance;
