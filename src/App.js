import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import Login from './components/Login';
import Dashboard from './admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PageNotFound from './components/PageNotFound';
import ConfirmPassword from './components/ConfirmPassword';
import Company from './admin/Company';
import AdminLayout from './layouts/AdminLayout';
import Employees from './admin/Employees';
import Inbox from './admin/Inbox';
import CalendarTodo from './admin/CalendarTodo';
import TimeAttendance from './admin/TimeAttendance';
import Jobs from './admin/Jobs';
import Candidates from './admin/Candidates';
import Structure from './admin/Structure';
import Reports from './admin/Reports';
import HR from './admin/HR';
import Admin from './admin/Admin';
import Payroll from './admin/Payroll';
import Invoices from './admin/Invoices';
import Billing from './admin/Billing';
import User from './admin/User';
import { getUserByID } from './services/userService';
import Departments from './admin/Departments';
import Designations from './admin/Designations';
import Department from './admin/Department';
import ImageUpload from './components/ImageUpload';
import UserProfile from './admin/UserProfile';
import AttendancePage from './admin/AttendancePage';

const App = () => {
    const checkUserStatus = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('userActive'));
            await getUserByID(user?._id); // Adjust this function as needed
        } catch (err) {
            console.error('Error checking user status:', err);
        }
    };
    useEffect(() => {
        // Set a timeout to change the message after 3 seconds
        const timer = setTimeout(() => {
            checkUserStatus();
        }, 60000);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (
        <Router>
            <Routes>
                {/* Default route redirects to /login or /dashboard based on auth */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Login route */}
                <Route path="/login" element={<Login />} />

                {/* Confirm password route */}
                <Route path="/confirm-password/:token" element={<ConfirmPassword />} />

                {/* Routes that require the AdminLayout and are protected */}
                <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/calendar-todo" element={<CalendarTodo />} />
                    <Route path="/time-attendance" element={<TimeAttendance />} />

                    {/* Group recruitments menu */}
                    <Route path="/recruitments/jobs" element={<Jobs />} />
                    <Route path="/recruitments/candidates" element={<Candidates />} />

                    {/* Group employee menu */}
                    <Route path="/employees/employee" element={<Employees />} />
                    <Route path="/employees/department" element={<Department />} />
                    <Route path="/employees/designation" element={<Designations />} />
                    <Route path="/employees/attendance" element={<AttendancePage />} />

                    {/* Group organization menu */}
                    <Route path="/organization/employee" element={<Employees />} />
                    <Route path="/organization/structure" element={<Structure />} />
                    <Route path="/organization/reports" element={<Reports />} />

                    {/* Group department menu */}
                    <Route path="/departments/:slug" element={<Departments />} />
                    <Route path="/departments/hr" element={<HR />} />
                    <Route path="/departments/admin" element={<Admin />} />

                    {/* Group finances menu */}
                    <Route path="/finances/payroll" element={<Payroll />} />
                    <Route path="/finances/invoices" element={<Invoices />} />
                    <Route path="/finances/billing" element={<Billing />} />

                    {/* Group setting menu */}
                    <Route path="/settings/company" element={<Company />} />
                    <Route path="/settings/user" element={<User />} />
                    <Route path="/user-profile" element={<UserProfile />} />

                    {/* Group upload image */}
                    <Route path="/upload-image" element={<ImageUpload />} />
                </Route>

                {/* Page Not Found route */}
                <Route path="/pagenotfound" element={<PageNotFound />} />

                {/* Redirect unknown routes to 404 page */}
                <Route path="*" element={<Navigate to="/pagenotfound" />} />
            </Routes>
        </Router>
    );
};

export default App;
