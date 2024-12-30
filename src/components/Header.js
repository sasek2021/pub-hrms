import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Dropdown, Badge, Image } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('userActive');
        navigate('/login');
    };

    const [user, setUser] = useState({});

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("userActive")) || {};
        setUser(loggedInUser);
    }, []);


    return (
        <Navbar bg="light" expand="lg" className="px-3 d-flex justify-content-between align-items-center shadow-sm">
            {/* Left Title */}
            <Navbar.Brand className="fw-bold d-flex align-items-center">
                {/* Sidebar Toggle Icon */}
                <Nav.Link onClick={toggleSidebar} className="p-0 me-2 d-flex align-items-center">
                    {isSidebarOpen ? <GoSidebarExpand size={20} /> : <GoSidebarCollapse size={20} />}
                </Nav.Link>
                <div className='vr'></div>
                <h4 className='mb-0 ms-2'>
                    My Dashboard
                </h4>
            </Navbar.Brand>

            {/* Right Notification & Profile */}
            <Nav className="ml-auto d-flex align-items-center">
                {/* Notification Icon */}
                <Nav.Link href="#" className="position-relative me-2">
                    <FaBell size={20} />
                    <Badge bg="danger" pill className="position-absolute translate-middle">
                        3
                    </Badge>
                </Nav.Link>

                {/* Profile Dropdown */}
                <Dropdown align="end">
                    <Dropdown.Toggle
                        variant="transparent"
                        className="d-flex align-items-center border-0 p-0"
                        style={{
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                        }}
                    >
                        <Image src={user.image || "https://via.placeholder.com/150"}
                            roundedCircle
                            alt="Profile"
                            className="rounded-circle me-2"
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/user-profile">View Profile</Dropdown.Item>
                        {/* <Dropdown.Item href="#/settings">Settings</Dropdown.Item> */}
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Nav>
        </Navbar>
    );
};

export default Header;
