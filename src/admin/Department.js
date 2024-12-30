import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; // Ensure to install react-icons
import { DataGrid } from '@mui/x-data-grid'; // Ensure you have @mui/x-data-grid installed
import { Row, Col, Modal, Form, Tabs, Tab, FloatingLabel, Button } from 'react-bootstrap'; // Ensure you have react-bootstrap installed
import Swal from 'sweetalert2';
import { createDepartment, deleteDepartmentByID, getDepartments, updateDepartmentByID } from '../services/departmentService';
import { getCompanies } from '../services/companyService';
import { getUsers } from '../services/userService';

const Department = () => {
    const [departments, setDepartments] = useState([]); // State to hold all departments
    const [filteredDesignation, setFilteredDesignation] = useState([]); // State for filtered departments
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
    const [departmentID, setDepartmentsId] = useState(null); // Example state for companyId
    const [showModal, setShowModal] = useState(false);
    const handleCloseDepartment = () => setShowModal(false);
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [managers, setManagers] = useState([]);
    const [formDataDepartment, setFormDataDepartment] = useState({
        name: "",
        status: "Active",
        code: "",
        slug: "",
        color: "",
        manager_id: "",
        company_id: "",
        description: ""
    });

    const fetchDepartments = async () => {
        try {
            // Managers can fetch all departments
            const response = await getDepartments(); // Adjust this function as needed
            console.log(response);

            // Add `company` and `manager` fields to each department
            const departmentsWithDetails = response.map(department => ({
                ...department,
                company: department.company_id.company_name || 'Unknown Company', // Add company field, default if not provided
                manager: department.manager_id.first_name || 'No Manager Assigned' // Add manager field, default if not provided
            }));
    
            setDepartments(departmentsWithDetails);
            setFilteredDesignation(departmentsWithDetails); // Set initial filtered department
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: `An error occurred: ${err.response.data.message}`,
                confirmButtonText: "OK"
            });
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await getCompanies(); // Adjust the URL if needed
            setCompanies(response);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

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

    useEffect(() => {
        fetchDepartments();
        fetchCompanies();
        fetchManagers();
    }, []);

    useEffect(() => {
        // Filter departments based on search term
        setFilteredDesignation(
            departments.filter(value =>
                value.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, departments]);

    const handleAddDepartment = () => {
        setDepartmentsId('');
        setFormDataDepartment({});
        setShowModal(true);
    };

    const handleSelectAllDeleteDepartment = async () => {
        try {
            const result = await Swal.fire({
                title: "Confirm Multiple Deletion",
                text: `Delete ${selectedRows.length} selected designation?`,
                icon: "warning",
                showCancelButton: true,
            });

            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleting...",
                    text: "Please wait while we delete the designation.",
                    icon: "info",
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                await Promise.all(selectedRows.map(id => deleteDepartmentByID(id)));
                fetchDepartments();
                setSelectedRows([]);
                Swal.fire("Deleted!", "Selected departments deleted.", "success");
            }
        } catch (err) {
            Swal.fire("Error", `Failed to delete multiple: ${err.response.data.message}`, "error");
        }
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: (params) => (
                <span className={params.value === "Active" ? "text-success" : "text-danger"}>
                    {params.value}
                </span>
            )
        },
        { field: 'company', headerName: 'Company', flex: 1 },
        { field: 'manager', headerName: 'Manager', flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.6,
            renderCell: (params) => {
                return (
                    <div className='h-100 d-flex align-items-center g-2' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleUpdateDepartment(params.row)}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteDepartment(params.row._id, params.row.name)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                );
            },
        },
    ];


    const handleUpdateDepartment = (params) => {
        if (params._id) {
            setDepartmentsId(params._id);
            setFormDataDepartment({
                name: params.name || '',
                status: params.status || '',
                code: params.code || '',
                slug: params.slug || '',
                color: params.color || '',
                manager_id: params.manager_id._id || '',
                company_id: params.company_id._id || '',
                description: params.description || ''
            });
        }
        setShowModal(true);
    };


    const handleDeleteDepartment = async (id, name) => {
        try {
            const result = await Swal.fire({
                title: "Confirm Deletion",
                text: `Are you sure you want to delete the department "${name}"? This action cannot be undone.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "Cancel"
            });

            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleting...",
                    text: "Please wait while we delete the department.",
                    icon: "info",
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                await deleteDepartmentByID(id); // Perform the deletion

                Swal.fire({
                    title: "Deleted!",
                    text: "The department has been deleted successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                fetchDepartments(); // Refresh branches
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Deletion Failed",
                text: `An error occurred: ${err.response.data.message}`,
                confirmButtonText: "OK"
            });
        }
    };

    const handleSubmitDepartment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if departmentID exists for update logic
            if (departmentID) {
                // Update Department information
                await updateDepartmentByID(departmentID, formDataDepartment);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Department updated successfully!',
                    confirmButtonText: 'OK',
                });
            } else {
                // Create Department logic
                await createDepartment(formDataDepartment);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Department created successfully!',
                    confirmButtonText: 'OK',
                });
            }

            // Fetch departments if necessary
            fetchDepartments();

            // Clear form and close modal
            setShowModal(false);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: `An error occurred: ${err.response.data.message || err.response.data.error}`,
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangeDepartment = (e) => {
        const { name, value } = e.target;
        setFormDataDepartment((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <div>
                <div className="d-flex justify-content-between align-items-center my-2">
                    <h6 className="m-0">{filteredDesignation.length} Departments</h6>
                    <button className="btn btn-primary btn-sm d-flex align-items-center"
                        onClick={handleAddDepartment}>
                        <FaPlus className="me-1" /> Add department
                    </button>
                </div>
                <Row>
                    <Col md="12">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                </Row>

                {selectedRows.length > 0 && (
                    <button
                        className="btn btn-danger btn-sm mb-3 d-flex align-items-center"
                        onClick={handleSelectAllDeleteDepartment}
                    >
                        <FaTrash className="pe-1" /> Delete Selected
                    </button>
                )}

                <div style={{ height: 371, width: "100%" }}>
                    <DataGrid
                        rows={filteredDesignation}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        getRowId={(row) => row._id}
                        checkboxSelection
                        disableSelectionOnClick
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setSelectedRows(newRowSelectionModel);
                        }}
                        componentsProps={{
                            pagination: {
                                className: 'custom-pagination' // Apply custom class here
                            },
                        }}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5, page: 0 },
                            },
                        }}
                    />
                </div>
            </div> {/* Designation data */}

            <Modal size="lg" show={showModal} onHide={handleCloseDepartment}>
                <Modal.Header closeButton>
                    <Modal.Title>{departmentID ? 'Edit department' : 'Add department'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitDepartment}>
                        <Tabs defaultActiveKey="departmentInfo" id="department-info-tabs" className="mb-3 custom-tabs">
                            <Tab eventKey="departmentInfo" title="Department Info">
                                <Row className='g-3'>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingName" label={<span>Code<span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter code"
                                                name="code"
                                                required
                                                value={formDataDepartment.code || ''}
                                                onChange={handleChangeDepartment}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingName" label={<span>Name<span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                name="name"
                                                required
                                                value={formDataDepartment.name || ''} // Ensure it is always defined
                                                onChange={handleChangeDepartment}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingStatus" label={<span>Status <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="status" // Corrected from "status"
                                                value={formDataDepartment.status || ''}
                                                onChange={handleChangeDepartment}
                                            >
                                                <option value="">Select status</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingManager" label={<span>Manager <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="manager_id"
                                                value={formDataDepartment.manager_id || ''}
                                                onChange={handleChangeDepartment}
                                            >
                                                <option value="">Select Manager</option>

                                                {managers.map(user => (
                                                    <option key={user._id} value={user._id}>
                                                        {user.first_name || '' + ' ' + user.last_name || ''}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingCompany" label={<span>Company <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="company_id"
                                                value={formDataDepartment.company_id || ''}
                                                onChange={handleChangeDepartment}
                                            >
                                                <option value="">Select Company</option>

                                                {companies.map(com => (
                                                    <option key={com._id} value={com._id}>
                                                        {com.company_name || ''}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDescription" label="Description">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter description"
                                                name="description"
                                                value={formDataDepartment.description || ''} // Ensure it is always defined
                                                onChange={handleChangeDepartment}
                                            />
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

        </>
    );
};

export default Department;
