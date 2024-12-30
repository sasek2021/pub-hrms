import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; // Ensure to install react-icons
import { DataGrid } from '@mui/x-data-grid'; // Ensure you have @mui/x-data-grid installed
import { Row, Col, Modal, Form, Tabs, Tab, FloatingLabel, Button } from 'react-bootstrap'; // Ensure you have react-bootstrap installed
import Swal from 'sweetalert2';
import { getDepartments } from '../services/departmentService';
import { createDesignation, deleteDesignationByID, getDesignations, updateDesignationByID } from '../services/designationService';

const Designations = () => {
    const [designations, setDesignation] = useState([]); // State to hold all designations
    const [filteredDesignation, setFilteredDesignation] = useState([]); // State for filtered designations
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
    const [designationId, setDesignationId] = useState(null); // Example state for companyId
    const [showModal, setShowModal] = useState(false);
    const handleCloseEmployee = () => setShowModal(false);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [formDataEmployee, setFormDataDesignation] = useState({
        title: "",
        description: "",
        level: "",
        department_id: ""
    });

    const fetchDesignation = async () => {
        try {
            // Managers can fetch all designations
            const response = await getDesignations(); // Adjust this function as needed
            setDesignation(response);
            setFilteredDesignation(response); // Set initial filtered designations to all designations
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: `An error occurred: ${err.response.data.message}`,
                confirmButtonText: "OK"
            });
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await getDepartments(); // Adjust the URL if needed
            setDepartments(response);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    useEffect(() => {
        fetchDesignation();
        fetchDepartments();
    }, []);

    useEffect(() => {
        // Filter designations based on search term
        setFilteredDesignation(
            designations.filter(value =>
                value.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, designations]);

    const handleAddDesignation = () => {
        setDesignationId('');
        setFormDataDesignation({});
        setShowModal(true);
    };

    const handleSelectAllDeleteDesignation = async () => {
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
                await Promise.all(selectedRows.map(id => deleteDesignationByID(id)));
                fetchDesignation();
                setSelectedRows([]);
                Swal.fire("Deleted!", "Selected designations deleted.", "success");
            }
        } catch (err) {
            Swal.fire("Error", `Failed to delete multiple: ${err.response.data.message}`, "error");
        }
    };

    const columns = [
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'level', headerName: 'Level', flex: 1 },
        {
            field: 'department_id',
            headerName: 'Department',
            flex: 1,
            valueGetter: (paramDepartmentId) => {
                const department = departments.find((c) => c._id === paramDepartmentId);
                return department ? department.name : 'Unknown';
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.6,
            renderCell: (params) => {
                return (
                    <div className='h-100 d-flex align-items-center g-2' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleUpdateDesignation(params.row)}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteDesignation(params.row._id, params.row.title)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                );
            },
        },
    ];


    const handleUpdateDesignation = (params) => {
        if (params._id) {
            setDesignationId(params._id);
            setFormDataDesignation({
                title: params.title || "",
                description: params.description || "",
                level: params.level || "",
                department_id: params.department_id || ""
            });
        }
        setShowModal(true);
    };


    const handleDeleteDesignation = async (id, name) => {
        try {
            const result = await Swal.fire({
                title: "Confirm Deletion",
                text: `Are you sure you want to delete the designation "${name}"? This action cannot be undone.`,
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
                    text: "Please wait while we delete the branch.",
                    icon: "info",
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                await deleteDesignationByID(id); // Perform the deletion

                Swal.fire({
                    title: "Deleted!",
                    text: "The branch has been deleted successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                fetchDesignation(); // Refresh branches
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

    const handleSubmitEmployee = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if designationId exists for update logic
            if (designationId) {
                // Update Employee information
                await updateDesignationByID(designationId, formDataEmployee);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Employee updated successfully!',
                    confirmButtonText: 'OK',
                });
            } else {
                // Create Employee logic
                await createDesignation(formDataEmployee);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Employee created successfully!',
                    confirmButtonText: 'OK',
                });
            }

            // Fetch designations if necessary
            fetchDesignation();

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

    const handleChangeDesignation = (e) => {
        const { name, value } = e.target;
        setFormDataDesignation((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <div>
                <div className="d-flex justify-content-between align-items-center my-2">
                    <h6 className="m-0">{filteredDesignation.length} Designations</h6>
                    <button className="btn btn-primary btn-sm d-flex align-items-center"
                        onClick={handleAddDesignation}>
                        <FaPlus className="me-1" /> Add designation
                    </button>
                </div>
                <Row>
                    <Col md="12">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search designation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                </Row>

                {selectedRows.length > 0 && (
                    <button
                        className="btn btn-danger btn-sm mb-3 d-flex align-items-center"
                        onClick={handleSelectAllDeleteDesignation}
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

            <Modal size="lg" show={showModal} onHide={handleCloseEmployee}>
                <Modal.Header closeButton>
                    <Modal.Title>{designationId ? 'Edit designation' : 'Add designation'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitEmployee}>
                        <Tabs defaultActiveKey="designationInfo" id="designation-info-tabs" className="mb-3 custom-tabs">
                            <Tab eventKey="designationInfo" title="Designation Info">
                                <Row className='g-3'>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingTitle" label={<span>Title<span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter title"
                                                name="title"
                                                required
                                                value={formDataEmployee.title || ''} // Ensure it is always defined
                                                onChange={handleChangeDesignation}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingLevel" label={<span>Level <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="level" // Corrected from "status" to "level"
                                                value={formDataEmployee.level || ''}
                                                onChange={handleChangeDesignation}
                                            >
                                                <option value="">Select Level</option>
                                                <option value="9">Grade - AA (9)</option>
                                                <option value="8">Grade - A (8)</option>
                                                <option value="7">Grade - B (7)</option>
                                                <option value="6">Grade - C (6)</option>
                                                <option value="5">Grade - D (5)</option>
                                                <option value="4">Grade - E (4)</option>
                                                <option value="3">Grade - F (3)</option>
                                                <option value="2">Grade - G (2)</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDepartment" label={<span>Department <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="department_id"
                                                value={formDataEmployee.department_id || ''}
                                                onChange={handleChangeDesignation}
                                            >
                                                <option value="">Select department</option>

                                                {departments.map(value => (
                                                    <option key={value._id} value={value._id}>
                                                        {value.name || ''}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={12}>
                                        <FloatingLabel controlId="floatingDescription" label="Description">
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Enter description"
                                                name="description"
                                                required
                                                value={formDataEmployee.description || ''} // Ensure it is always defined
                                                onChange={handleChangeDesignation}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                        <Button variant="primary" type="submit" disabled={loading} className='my-3'>
                            {loading ? 'Saving...' : designationId ? 'Save & change' : 'Save employee'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default Designations;
