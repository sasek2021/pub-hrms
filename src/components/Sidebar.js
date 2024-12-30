import React, { useEffect, useState } from 'react';
import { Nav, Accordion, Modal, Tabs, Row, Col, Button, Tab, Form, FloatingLabel } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBuilding, FaUserFriends, FaInbox, FaCalendarAlt, FaClock, FaCog, FaUser, FaSignOutAlt, FaMoneyBillWave, FaMoneyCheckAlt, FaFileInvoice, FaFileInvoiceDollar, FaSitemap, FaFileAlt, FaClipboardList, FaBriefcase, FaUserCheck, FaPlus, FaCalendarCheck, FaRegCalendarAlt, FaUserTie } from 'react-icons/fa'; // Import icons
import { colors } from '../config';
import '../styles/Sidebar.css'; // Import your CSS for hover and active effect
import Swal from 'sweetalert2';
import { createDepartment, getDepartments, updateDepartmentByID } from '../services/departmentService';
import { getUsers } from '../services/userService';
import { getCompanies } from '../services/companyService';
import { BiRefresh } from 'react-icons/bi';

const Sidebar = ({ isOpen }) => {
    const location = useLocation(); // Get the current route location
    const sidebarWidth = isOpen ? '250px' : '0px';
    const [showModal, setShowModal] = useState(false);
    const [departmentID, setDepartmentID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [managers, setManagers] = useState([]);
    const [departments, setDepartment] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filter, setFilter] = useState('');
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        status: "Active",
        manager_id: "",
        company_id: "",
        color: "#EA868F",
        description: ""
    });
    const fetchDepartments = async () => {
        try {
            const response = await getDepartments(); // Assume this retrieves an array of user objects
            setDepartment(response);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response?.data?.message || err.response?.data?.error || 'An unexpected error occurred.',
                confirmButtonText: 'OK',
            });
        }
    }

    const fetchManagers = async () => {
        try {
            const response = await getUsers(); // Assume this retrieves an array of user objects
            const managerList = response.filter(user => user.role === 'Manager');
            setManagers(managerList);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response?.data?.message || err.response?.data?.error || 'An unexpected error occurred.',
                confirmButtonText: 'OK',
            });
        }
    }

    const fetchCompanies = async () => {
        try {
            const response = await getCompanies(); // Assume this retrieves an array of user objects
            setCompanies(response);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response?.data?.message || err.response?.data?.error || 'An unexpected error occurred.',
                confirmButtonText: 'OK',
            });
        }
    }

    useEffect(() => {
        fetchDepartments();
        fetchManagers();
        fetchCompanies();
    }, []);

    const handleRefreshDepartment = () => {
        fetchDepartments();
    };




    const handleAddDepartment = () => {
        setShowModal(true);
        setDepartmentID(null);
        setFormData({
            code: "",
            name: "",
            status: "Active",
            manager_id: "",
            company_id: "",
            color: "#EA868F",
            description: ""
        });
    };

    const handleChangeDepartment = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCloseDepartment = () => setShowModal(false);

    const handleSubmitDepartment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (departmentID) {
                await updateDepartmentByID(departmentID, formData);
                fetchDepartments();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Department updated successfully!',
                    confirmButtonText: 'OK',
                });
                setShowModal(false);
            } else {
                const response = await createDepartment(formData);
                setDepartmentID(response._id);
                setFormData(response);
                fetchDepartments();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Department created successfully!',
                    confirmButtonText: 'OK',
                });
                setShowModal(false);
            }
            // Clear form or redirect here if needed
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response?.data?.message || err.response?.data?.error || 'An unexpected error occurred.',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle input change for filtering
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Filter departments based on the input value
    const filteredDepartments = departments.filter(department =>
        department.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="sidebar"
            style={{
                width: sidebarWidth, // Use the defined width here
                height: '100vh',
                position: 'fixed',
                backgroundColor: colors.background, // Replace with your colors.background if you have a color variable
                transition: 'width 0.1s ease', // Smooth transition for width change
                overflow: 'hidden', // Prevent content overflow
                borderRight: '1px solid #dee2e6', // Optional border
                zIndex: 1000 // Ensure it overlays content
            }}>
            <h6 className='p-3 mb-0 text-light'>HRM Dashboard</h6>
            <Nav className="flex-column">
                <Nav.Link as={Link} to="/dashboard" className={`d-flex align-items-center text-light ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <FaTachometerAlt style={{ marginRight: '8px' }} /> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/inbox" className={`d-flex align-items-center text-light ${location.pathname === '/inbox' ? 'active' : ''}`}>
                    <FaInbox style={{ marginRight: '8px' }} /> Inbox
                </Nav.Link>
                <Nav.Link as={Link} to="/calendar-todo" className={`d-flex align-items-center text-light ${location.pathname === '/calendar-todo' ? 'active' : ''}`}>
                    <FaCalendarAlt style={{ marginRight: '8px' }} /> Calendar & Todo
                </Nav.Link>
                <Nav.Link as={Link} to="/time-attendance" className={`d-flex align-items-center text-light ${location.pathname === '/time-attendance' ? 'active' : ''}`}>
                    <FaClock style={{ marginRight: '8px' }} /> Time & Attendance
                </Nav.Link>

                {/* Collapsible Section */}
                <Accordion flush>
                    {/* Collapsible Employee Section */}
                    <Accordion.Item eventKey="5">
                        <Accordion.Header className='d-flex align-items-center'>
                            <FaBuilding style={{ marginRight: '8px' }} /> Employees
                        </Accordion.Header>
                        <Accordion.Body>
                            <Nav.Link as={Link} to="/employees/employee" className={`d-flex align-items-center text-light ${location.pathname === '/employees/employee' ? 'active' : ''}`}>
                                <FaUserFriends style={{ marginRight: '8px' }} /> All Employees
                            </Nav.Link>
                            <Nav.Link as={Link} to="/employees/department" className={`d-flex align-items-center text-light ${location.pathname === '/employees/department' ? 'active' : ''}`}>
                                <FaBuilding style={{ marginRight: '8px' }} /> Department
                            </Nav.Link>                            
                            <Nav.Link as={Link} to="/employees/designation" className={`d-flex align-items-center text-light ${location.pathname === '/employees/designation' ? 'active' : ''}`}>
                                <FaUserTie style={{ marginRight: '8px' }} /> Designations
                            </Nav.Link>
                            <Nav.Link as={Link} to="/employees/attendance" className={`d-flex align-items-center text-light ${location.pathname === '/organization/attendance' ? 'active' : ''}`}>
                                <FaCalendarCheck style={{ marginRight: '8px' }} /> Attendance
                            </Nav.Link>
                            <Nav.Link as={Link} to="/organization/holidays" className={`d-flex align-items-center text-light ${location.pathname === '/organization/holidays' ? 'active' : ''}`}>
                                <FaRegCalendarAlt style={{ marginRight: '8px' }} /> Holidays
                            </Nav.Link>
                            <Nav.Link as={Link} to="/organization/reports" className={`d-flex align-items-center text-light ${location.pathname === '/organization/reports' ? 'active' : ''}`}>
                                <FaFileAlt style={{ marginRight: '8px' }} /> Reports
                            </Nav.Link>
                        </Accordion.Body>
                    </Accordion.Item>
                    {/* Collapsible Recruitments Section */}
                    <Accordion.Item eventKey="4">
                        <Accordion.Header className='d-flex align-items-center'>
                            <FaClipboardList style={{ marginRight: '8px' }} /> Recruitments
                        </Accordion.Header>
                        <Accordion.Body className="bg-transparent">
                            <Nav.Link as={Link} to="/recruitments/jobs" className={`d-flex align-items-center text-light ${location.pathname === '/recruitments/jobs' ? 'active' : ''}`}>
                                <FaBriefcase style={{ marginRight: '8px' }} /> Jobs
                            </Nav.Link>
                            <Nav.Link as={Link} to="/recruitments/candidates" className={`d-flex align-items-center text-light ${location.pathname === '/recruitments/candidates' ? 'active' : ''}`}>
                                <FaUserCheck style={{ marginRight: '8px' }} /> Candidates
                            </Nav.Link>
                        </Accordion.Body>
                    </Accordion.Item>
                    {/* Collapsible Organization Section */}
                    <Accordion.Item eventKey="3">
                        <Accordion.Header className='d-flex align-items-center'>
                            <FaBuilding style={{ marginRight: '8px' }} /> Organization
                        </Accordion.Header>
                        <Accordion.Body className="bg-transparent">
                            <Nav.Link as={Link} to="/organization/employee" className={`d-flex align-items-center text-light ${location.pathname === '/organization/employee' ? 'active' : ''}`}>
                                <FaUserFriends style={{ marginRight: '8px' }} /> Employees
                            </Nav.Link>
                            <Nav.Link as={Link} to="/organization/structure" className={`d-flex align-items-center text-light ${location.pathname === '/organization/structure' ? 'active' : ''}`}>
                                <FaSitemap style={{ marginRight: '8px' }} /> Structure
                            </Nav.Link>
                            <Nav.Link as={Link} to="/organization/reports" className={`d-flex align-items-center text-light ${location.pathname === '/organization/reports' ? 'active' : ''}`}>
                                <FaFileAlt style={{ marginRight: '8px' }} /> Reports
                            </Nav.Link>
                        </Accordion.Body>
                    </Accordion.Item>
                    {/* Collapsible Departments Section */}
                    <Accordion.Item eventKey="2">
                        <Accordion.Header className='d-flex align-items-center'>
                            <FaUser style={{ marginRight: '8px' }} /> Departments
                        </Accordion.Header>
                        <Accordion.Body className="bg-transparent">
                            <div className='d-flex align-items-center gap-2'>
                                <button className="btn btn-primary btn-sm d-flex align-items-center mb-3"
                                    onClick={handleAddDepartment}>
                                    <FaPlus className="me-1" /> Add
                                </button>
                                <button className="btn btn-secondary btn-sm d-flex align-items-center mb-3"
                                    onClick={handleRefreshDepartment}>
                                    <BiRefresh className='fs-5' />
                                </button>
                            </div>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Filter departments..."
                                    value={filter}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            {filteredDepartments.map(department => (
                                <Nav.Link
                                    as={Link}
                                    key={department.slug}
                                    to={`/departments/${department.slug}`} // Assuming 'slug' provides URL-safe name
                                    className={`d-flex align-items-center text-light ${location.pathname === `/departments/${department.slug}` ? 'active' : ''}`}
                                >
                                    <span style={{ backgroundColor: department.color }} className='p-2 me-2'></span> {department.name}
                                </Nav.Link>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                    {/* Collapsible Finances Section */}
                    <Accordion.Item eventKey="1">
                        <Accordion.Header className='d-flex align-items-center'>
                            <FaMoneyBillWave style={{ marginRight: '8px' }} /> Finances
                        </Accordion.Header>
                        <Accordion.Body className="bg-transparent">
                            <Nav.Link as={Link} to="/finances/payroll" className={`d-flex align-items-center text-light ${location.pathname === '/finances/payroll' ? 'active' : ''}`}>
                                <FaMoneyCheckAlt style={{ marginRight: '8px' }} /> Payroll
                            </Nav.Link>
                            <Nav.Link as={Link} to="/finances/invoices" className={`d-flex align-items-center text-light ${location.pathname === '/finances/invoices' ? 'active' : ''}`}>
                                <FaFileInvoice style={{ marginRight: '8px' }} /> Invoices
                            </Nav.Link>
                            <Nav.Link as={Link} to="/finances/billing" className={`d-flex align-items-center text-light ${location.pathname === '/finances/billing' ? 'active' : ''}`}>
                                <FaFileInvoiceDollar style={{ marginRight: '8px' }} /> Billing
                            </Nav.Link>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* Collapsible Settings Section */}
                    <Accordion.Item eventKey="0">
                        <Accordion.Header className='d-flex align-items-center'>
                            <FaCog style={{ marginRight: '8px' }} /> Settings
                        </Accordion.Header>
                        <Accordion.Body className="bg-transparent">
                            <Nav className="flex-column">
                                <Nav.Link as={Link} to="/settings/company" className={`d-flex align-items-center text-light ${location.pathname === '/settings/company' ? 'active' : ''}`}>
                                    <FaBuilding style={{ marginRight: '8px' }} /> Company
                                </Nav.Link>
                                <Nav.Link as={Link} to="/settings/user" className={`d-flex align-items-center text-light ${location.pathname === '/settings/user' ? 'active' : ''}`}>
                                    <FaUser style={{ marginRight: '8px' }} /> User
                                </Nav.Link>
                                <Nav.Link as={Link} to="/login" className='d-flex align-items-center text-light' onClick={() => localStorage.removeItem('userActive')}>
                                    <FaSignOutAlt style={{ marginRight: '8px' }} /> Sign Out
                                </Nav.Link>
                            </Nav>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Nav>

            <Modal size="lg" show={showModal} onHide={handleCloseDepartment} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>{departmentID ? 'Edit Department' : 'Add Department'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitDepartment}>
                        <Tabs defaultActiveKey="departmentInfo" id="department-info-tabs" className="mb-3 custom-tabs">
                            <Tab eventKey="departmentInfo" title="Department Info">
                                <Row className='g-3'>
                                    <Col md={4} className='d-flex align-items-center'>
                                        {/* Color Picker for Department Icon */}
                                        <Form.Control
                                            type="color"
                                            name="color"
                                            value={formData.color} // Default color or previously selected color
                                            onChange={handleChangeDepartment}
                                            title="Pick a color for the department icon"
                                            className='me-3'
                                        />
                                        <FloatingLabel controlId="floatingDepartmentCode" label={<span>Code <span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter code"
                                                name="code"
                                                required
                                                value={formData.code || ''} // Ensure it is always defined
                                                onChange={handleChangeDepartment} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDepartmentName" label={<span>Name <span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                name="name"
                                                required
                                                value={formData.name || ''} // Ensure it is always defined
                                                onChange={handleChangeDepartment} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDepartmentStatus" label={<span>Status <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="status"
                                                value={formData.status || ''}
                                                onChange={handleChangeDepartment}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel
                                            controlId="floatingDepartmentManager"
                                            label={<span>Manager <span className="text-danger">*</span></span>}
                                        >
                                            <Form.Select
                                                name="manager_id"
                                                value={formData.manager_id || ''}
                                                onChange={handleChangeDepartment}
                                            >
                                                <option value="">Select manager</option>
                                                {managers.map(manager => (
                                                    <option key={manager._id} value={manager._id}>
                                                        {manager.last_name || '' + ' ' + manager.first_name || ''}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel
                                            controlId="floatingDepartmentManager"
                                            label={<span>Company <span className="text-danger">*</span></span>}
                                        >
                                            <Form.Select
                                                name="company_id"
                                                value={formData.company_id || ''}
                                                onChange={handleChangeDepartment}
                                            >
                                                <option value="">Select company</option>
                                                {companies.map(company => (
                                                    <option key={company._id} value={company._id}>
                                                        {company.company_name || ''}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDepartmentDesc" label="Description">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter desc"
                                                name="description"
                                                value={formData.description || ''} // Ensure it is always defined
                                                onChange={handleChangeDepartment} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                        <Button variant="primary" type="submit" disabled={loading} className='my-3'>
                            {loading ? 'Saving...' : departmentID ? 'Save & change' : 'Save'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default Sidebar;
