import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../themeAdmin.css';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Set initial state as needed

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <Sidebar isOpen={isSidebarOpen} />
            <div style={{ marginLeft: isSidebarOpen ? '250px' : '0px' }}> {/* Adjust margin based on sidebar state */}
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <div className='p-3'>
                    <Outlet />
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default AdminLayout;
