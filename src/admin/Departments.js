import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDepartment, getDepartmentBySlug, updateDepartmentByID } from '../services/departmentService';
import { Button, Card, Col, Form, Modal, Row, Tabs, Tab, FloatingLabel
} from 'react-bootstrap';
import { getUsers } from '../services/userService';
import { getCompanies } from '../services/companyService';
import Swal from 'sweetalert2';

const Departments = () => {
    const navigate = useNavigate();
    const { slug } = useParams(); // Get the slug from the URL
    const [department, setDepartment] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        status: "Active",
        manager_id: "",
        company_id: {
            _id: ""
        },
        color: "#EA868F",
        desc: ""
    }); // Form data state
    const [departmentID, setDepartmentID] = useState(null); // For edit mode
    const [companies, setCompanies] = useState([]);
    const [managers, setManagers] = useState([]);
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
        fetchManagers();
        fetchCompanies();
    }, []);

    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const response = await getDepartmentBySlug(slug);
                setDepartment(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartment();
    }, [slug]);

    const handleEditDepartment = () => {
        setFormData(department); // Preload current department data for editing
        setDepartmentID(department._id);
        setShowModal(true);
    };

    // const handleAddTeamMember = () => {
    //     console.log('Add team member clicked');
    // };

    const handleCloseDepartment = () => setShowModal(false);

    const handleChangeDepartment = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmitDepartment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (departmentID) {
                const response = await updateDepartmentByID(departmentID, formData);
                setDepartment(response);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Department updated successfully!',
                    confirmButtonText: 'OK',
                });
                setShowModal(false);
                navigate(`/departments/${response.slug}`);
            } else {
                const response = await createDepartment(formData);
                setDepartmentID(response._id);
                setFormData(response);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Department</Card.Title>
                            {department ? (
                                <div>
                                    <p className='mb-1'><strong>Name: </strong> {department.name}</p>
                                    <p className='mb-1'><strong>Status: </strong>
                                        <span className={department.status === 'Active' ? 'text-primary' : 'text-danger'}>
                                            {department.status}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <p>No department data available.</p>
                            )}
                            <Card.Text className='text-muted'>{department.desc || 'No description available.'}</Card.Text>

                            <Card.Title>Manager</Card.Title>
                            {department.manager_id ? (
                                <div>
                                    <p className='mb-1'><strong>Name:</strong> {department.manager_id.first_name}</p>
                                    <p><strong>Email:</strong> {department.manager_id.email}</p>
                                </div>
                            ) : (
                                <p>No manager assigned.</p>
                            )}

                            <div className="d-flex flex-column gap-2">
                                <Button variant="primary" className="" onClick={handleEditDepartment}>Edit Department</Button>
                                {/* <Button variant="success" onClick={handleAddTeamMember}>Add Team Member</Button> */}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

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
                                        <Form.Control
                                            type="color"
                                            name="color"
                                            value={formData.color || ''} // Default color or previously selected color
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
                                                value={formData.code || ''} 
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
                                                value={formData.name || ''} 
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
                                        <FloatingLabel controlId="floatingDepartmentManager" label={<span>Manager <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="manager_id"
                                                value={formData.manager_id._id || ''}
                                                onChange={handleChangeDepartment}
                                            >
                                                <option value="">Select manager</option>
                                                {managers.map(manager => (
                                                    <option key={manager._id} value={manager._id}>
                                                        {manager.first_name || '' + ' ' + manager.last_name || ''}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDepartmentCompany" label={<span>Company <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="company_id"
                                                value={formData.company_id || ''}
                                                onChange={handleChangeDepartment}
                                            >
                                                <option value="">Select company</option>
                                                {companies.map(company => (
                                                    <option key={company._id} value={company._id}>
                                                        {company.company_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDepartmentDesc" label="Description">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter description"
                                                name="desc"
                                                value={formData.desc || ''} 
                                                onChange={handleChangeDepartment} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                        <Button variant="primary" type="submit" disabled={loading} className='my-3'>
                            {loading ? 'Saving...' : departmentID ? 'Save & Change' : 'Save'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Departments;
