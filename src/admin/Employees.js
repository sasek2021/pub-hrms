import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; // Ensure to install react-icons
import { DataGrid } from '@mui/x-data-grid'; // Ensure you have @mui/x-data-grid installed
import { Row, Col, Modal, Form, Tabs, Tab, FloatingLabel, Button, InputGroup } from 'react-bootstrap'; // Ensure you have react-bootstrap installed
import Swal from 'sweetalert2';
import PhoneInput from 'react-phone-input-2';
import { getCompanies } from '../services/companyService';
import { createEmployee, deleteEmployeeByID, getEmployees, updateEmployeeByID } from '../services/employeeService';
import { getDesignations } from '../services/designationService';
import { getDepartments } from '../services/departmentService';
import ImageUpload from '../components/ImageUpload';
import { getImageName } from '../utils/GetImageName';
import { deleteImage } from '../services/imageUploadService';

const Employees = () => {
    const [employees, setEmployee] = useState([]); // State to hold all employees
    const [filteredEmployee, setFilteredEmployee] = useState([]); // State for filtered employees
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
    const [employeeId, setEmployeeId] = useState(null); // Example state for companyId
    const [showModal, setShowModal] = useState(false);
    const handleCloseEmployee = () => setShowModal(false);
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [allDesignations, setAllDesignations] = useState([]); // All designations
    const [departments, setDepartments] = useState([]);
    const [isDeleteImage, setIsDeleteImage] = useState(false);

    const [formDataEmployee, setFormDataEmployee] = useState({
        employee_no: '', // Employee Number
        status: "Active", // Add status field
        last_name: '', // Last Name
        first_name: '', // First Name
        birthdate: '', // Birthdate
        gender: '', // Gender
        hire_date: '', // Hire Date
        religion: '', // Religion
        marital_status: '', // Marital Status
        dependents: 0, // Dependents
        birth_place: '', // Birth Place
        first_language: '', // First Language
        second_language: '', // Second Language
        degree: '', // Degree
        passport_number: '', // Passport Number
        id_number: '', // ID Number
        work_permit_number: '', // Work Permit Number
        medical_insurance_number: '', // Medical Insurance Number
        reference_number: '', // Reference Number
        foreigner: false, // Is Foreigner
        smoker: false, // Is Smoker
        disability: false, // Is Disabled
        entity: '', // Entity
        employee_type: '', // Employee Type
        job: '', // Job Title
        work_calendar: '', // Work Calendar
        seniority_date: '', // Seniority Date
        effective_date: '', // Effective Date
        job_expiry_date: '', // Job Expiry Date
        career_start_date: '', // Career Start Date
        working_age_date: '', // Working Age Date
        last_revise_date: '', // Last Revise Date
        termination_date: '', // Termination Date
        last_hire_date: '', // Last Hire Date
        labor_contract_sign: '', // Labor Contract Sign Date
        email: '', // Email
        phone: '', // E.164 phone format
        position: '', // Position
        salary: 0, // Salary
        date_of_joining: new Date(), // Date of Joining
        attendance: [], // Attendance reference
        image: '', // image 
        id_front: '', // id front 
        id_back: '', // id back 
        passport_front: '',
        passport_back: '',
        company_id: '',
        department_id: '',
        position_id: ''
    });


    const fetchEmployee = async () => {
        try {
            // Managers can fetch all employees
            const response = await getEmployees(); // Adjust this function as needed
            setEmployee(response);
            setFilteredEmployee(response); // Set initial filtered employees to all employees
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: `An error occurred: ${err.response.data.message}`,
                confirmButtonText: "OK"
            });
        }
    };


    // Function to fetch companies
    const fetchCompanies = async () => {
        try {
            const response = await getCompanies(); // Adjust this function as needed
            setCompanies(response); // Assuming response is an array of company names or objects with name properties
        } catch (err) {
            console.error("Error fetching companies:", err.response.data.message);
        }
    };

    // Function to fetch designations
    const fetchDesignations = async () => {
        try {
            const response = await getDesignations(); // Adjust this function as needed
            // setDesignations(response); // Assuming response is an array of company names or objects with name properties
            setAllDesignations(response); // Store all designations
            setDesignations(response); // Default to showing all
        } catch (err) {
            console.error("Error fetching designation:", err.response.data.message);
        }
    };

    // Function to fetch designations
    const fetchDepartment = async () => {
        try {
            const response = await getDepartments(); // Adjust this function as needed
            setDepartments(response); // Assuming response is an array of company names or objects with name properties
        } catch (err) {
            console.error("Error fetching department:", err.response.data.message);
        }
    };

    useEffect(() => {
        fetchEmployee();
        fetchCompanies();
        fetchDesignations();
        fetchDepartment();
    }, []);

    useEffect(() => {
        // Filter employees based on search term
        setFilteredEmployee(
            employees.filter(employee =>
                employee.first_name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, employees]);

    const handleAddEmployee = () => {
        setEmployeeId('');
        setShowModal(true);
    };

    const handleSelectAllDeleteEmployees = async () => {
        try {
            const result = await Swal.fire({
                title: "Confirm Multiple Deletion",
                text: `Delete ${selectedRows.length} selected employees?`,
                icon: "warning",
                showCancelButton: true,
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
                await Promise.all(selectedRows.map(id => deleteEmployeeByID(id)));
                fetchEmployee();
                setSelectedRows([]);
                Swal.fire("Deleted!", "Selected employees deleted.", "success");
            }
        } catch (err) {
            Swal.fire("Error", `Failed to delete multiple: ${err.response.data.message}`, "error");
        }
    };

    const columns = [
        { field: 'employee_no', headerName: 'Employee No', flex: 1 },
        { field: 'first_name', headerName: 'First Name', flex: 1 },
        { field: 'gender', headerName: 'Gender', flex: 1 },
        {
            field: 'employee_type',
            headerName: 'Employee type',
            flex: 1,
            renderCell: (params) => {
                const roleClassMap = {
                    'Full-time': 'text-primary',
                    'Part-time': 'text-info',
                    'Contract': 'text-secondary',
                };
                const roleText = params.value || 'Unknown Role';
                const roleClass = roleClassMap[params.value] || 'text-muted';

                return <span className={roleClass}>{roleText}</span>;
            },
        },
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
        {
            field: 'company_id',
            headerName: 'Company',
            flex: 1,
            valueGetter: (paramCompanyId) => {
                const company = companies.find((c) => c._id === paramCompanyId);
                return company ? company.company_name : 'Unknown';
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
                            onClick={() => handleUpdateEmployee(params.row)}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteEmployee(params?.row)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                );
            },
        },
    ];


    const handleUpdateEmployee = (employee) => {
        if (employee._id) {
            setEmployeeId(employee._id);
            setFormDataEmployee({
                employee_no: employee.employee_no || '',
                status: employee.status || 'Active',
                last_name: employee.last_name || '',
                first_name: employee.first_name || '',
                birthdate: employee.birthdate || '',
                gender: employee.gender || '',
                hire_date: employee.hire_date || '',
                religion: employee.religion || '',
                marital_status: employee.marital_status || '',
                dependents: employee.dependents || 0,
                birth_place: employee.birth_place || '',
                first_language: employee.first_language || '',
                second_language: employee.second_language || '',
                degree: employee.degree || '',
                passport_number: employee.passport_number || '',
                id_number: employee.id_number || '',
                work_permit_number: employee.work_permit_number || '',
                medical_insurance_number: employee.medical_insurance_number || '',
                reference_number: employee.reference_number || '',
                foreigner: employee.foreigner || false,
                smoker: employee.smoker || false,
                disability: employee.disability || false,
                entity: employee.entity || '',
                employee_type: employee.employee_type || '',
                job: employee.job || '',
                work_calendar: employee.work_calendar || '',
                seniority_date: employee.seniority_date || '',
                effective_date: employee.effective_date || '',
                job_expiry_date: employee.job_expiry_date || '',
                career_start_date: employee.career_start_date || '',
                working_age_date: employee.working_age_date || '',
                last_revise_date: employee.last_revise_date || '',
                termination_date: employee.termination_date || '',
                last_hire_date: employee.last_hire_date || '',
                labor_contract_sign: employee.labor_contract_sign || '',
                email: employee.email || '',
                phone: employee.phone || '',
                position_id: employee.position_id || '',
                salary: employee.salary || 0,
                date_of_joining: employee.date_of_joining || new Date(),
                attendance: employee.attendance || [],
                company_id: employee.company_id || '',
                department_id: employee.department_id || '',
                image: employee.image || '',
                id_front: employee.id_front || '',
                id_back: employee.id_back || '',
                passport_front: employee.passport_front || '',
                passport_back: employee.passport_back || '',
            });
        }
        console.log(formDataEmployee.image);
        setShowModal(true);
    };


    const handleDeleteEmployee = async (item) => {
        try {
            const result = await Swal.fire({
                title: "Confirm Deletion",
                text: `Are you sure you want to delete the employee "${item?.first_name}"? This action cannot be undone.`,
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

                // Delete associated images concurrently, ensuring image names are valid
                const imageFields = [
                    item?.image,
                    item?.id_front,
                    item?.id_back,
                    item?.passport_front,
                    item?.passport_back,
                ];

                // Filter out undefined or null image names
                const validImageFields = imageFields.filter(imageName => imageName);

                // Delete images concurrently, waiting for all to finishs
                try {
                    await Promise.all(validImageFields.map((existingImageUrl) => {
                        const imageName = getImageName(existingImageUrl);
                        deleteImage(imageName)
                    }));
                } catch (error) {
                    console.log('Error delete image', error);
                }

                await deleteEmployeeByID(item?._id); // Perform the deletion

                Swal.fire({
                    title: "Deleted!",
                    text: "The branch has been deleted successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                fetchEmployee(); // Refresh branches
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

    // Updated handleImageUrl function
    const handleImageUrl = (field, url) => {
        setFormDataEmployee((prevData) => ({
            ...prevData,
            [field]: url, // Update the specific field with the URL
        }));
    };

    const handleSubmitEmployee = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if employeeId exists for update logic
            if (employeeId) {
                // Update Employee information
                await updateEmployeeByID(employeeId, formDataEmployee);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Employee updated successfully!',
                    confirmButtonText: 'OK',
                });
            } else {
                // Create Employee logic
                await createEmployee(formDataEmployee);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Employee created successfully!',
                    confirmButtonText: 'OK',
                });
            }
            setIsDeleteImage(true);
            // Fetch employees if necessary
            fetchEmployee();

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


    const handleChangeEmployee = (e) => {
        const { name, value } = e.target;
        setFormDataEmployee((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // If Department is Changed, Filter Designations
        if (name === 'department_id') {
            const selectedDepartment = departments.find((d) => d._id === value);
            const filteredDesignations = allDesignations.filter(
                (designation) => designation.department_id === selectedDepartment?._id
            );
            setDesignations(filteredDesignations); // Update filtered designations
            setFormDataEmployee((prev) => ({
                ...prev,
                position: '', // Reset position field
            }));
        }

        if (name === 'position_id') {
            // Find the selected designation based on the value
            const selectedDesignation = designations.find((designation) => designation._id === value);
            if (selectedDesignation) {
                // Automatically set the corresponding department_id
                setFormDataEmployee((prev) => ({
                    ...prev, // Retain other form fields
                    department_id: selectedDesignation.department_id, // Set the related department ID
                }));
            }
        }
        
    };

    const handleChangePhone = (phone, countryData) => {
        setFormDataEmployee(prevData => ({
            ...prevData,
            phone, // New phone value
            country: countryData.name // Ensure country data is being accessed correctly
        }));
    };
    const handleKeyDown = (event) => {
        // Check if the first character is '0' and if it's the first key pressed
        if (formDataEmployee?.phone?.length === 0 && event?.key === '0') {
            event.preventDefault(); // Prevent '0' from being entered at the start
        }
    };

    return (
        <>
            <div>
                <div className="d-flex justify-content-between align-items-center my-2">
                    <h6 className="m-0">{filteredEmployee.length} Employees</h6>
                    <button className="btn btn-primary btn-sm d-flex align-items-center"
                        onClick={handleAddEmployee}>
                        <FaPlus className="me-1" /> Add employee
                    </button>
                </div>
                <Row>
                    <Col md="12">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                </Row>

                {selectedRows.length > 0 && (
                    <button
                        className="btn btn-danger btn-sm mb-3 d-flex align-items-center"
                        onClick={handleSelectAllDeleteEmployees}
                    >
                        <FaTrash className="pe-1" /> Delete Selected
                    </button>
                )}

                <div style={{ height: 371, width: "100%" }}>
                    <DataGrid
                        rows={filteredEmployee}
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
            </div> {/* Employee data */}

            <Modal size="lg" show={showModal} onHide={handleCloseEmployee} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{employeeId ? 'Edit employee' : 'Add employee'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitEmployee}>
                        <Tabs defaultActiveKey="employeeInfo" id="employee-info-tabs" className="mb-3 custom-tabs">
                            <Tab eventKey="employeeInfo" title="Employee Info">
                                <Row className='g-3'>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingEmployeeNo" label={<span>Employee No <span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Employee No"
                                                name="employee_no"
                                                required
                                                value={formDataEmployee.employee_no || ''} // Ensure it is always defined
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingStatus" label={<span>Status <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="status"
                                                value={formDataEmployee.status}
                                                onChange={handleChangeEmployee}
                                            >
                                                <option value="">Select Status</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Resign">Resign</option>
                                                <option value="Sick Leave">Sick Leave</option>
                                                <option value="Vacation Leave">Vacation Leave</option>
                                                <option value="Parental Leave">Parental Leave</option>
                                                <option value="Unpaid Leave">Unpaid Leave</option>
                                                <option value="Probation">Probation</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingLastName" label="Last Name">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Last Name"
                                                name="last_name"
                                                value={formDataEmployee.last_name || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingFirstName" label={<span>First Name <span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter First Name"
                                                name="first_name"
                                                required
                                                value={formDataEmployee.first_name || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingBirthdate" label={<span>DoB <span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter Birthdate"
                                                name="birthdate"
                                                required
                                                value={formDataEmployee.birthdate ? formDataEmployee.birthdate.substring(0, 10) : ''} // Format date
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingGender" label={<span>Gender <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="gender"
                                                required
                                                value={formDataEmployee.gender || ''}
                                                onChange={handleChangeEmployee}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingHireDate" label={<span>Hire Date <span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="date"
                                                placeholder="Enter Hire Date"
                                                name="hire_date"
                                                required
                                                value={formDataEmployee.hire_date ? formDataEmployee.hire_date.substring(0, 10) : ''} // Format date
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingEmail" label="Email">
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                name="email"
                                                value={formDataEmployee.email || ''} // Ensure it is always defined
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <PhoneInput
                                            enableSearch
                                            country={"kh"} // Default country code
                                            value={formDataEmployee.phone}
                                            onChange={handleChangePhone} // Pass the phone value directly
                                            onKeyDown={handleKeyDown} // Add this line
                                            placeholder="Enter phone number"
                                            inputStyle={{
                                                width: "100%",
                                                height: "calc(3.5rem + 2px)", // Height matches Bootstrap's 'lg' Form.Control
                                                fontSize: "1rem", // Font size for readability
                                                paddingTop: "0.375rem", // Padding to match FloatingLabel input
                                                paddingBottom: "0.375rem", // Padding to match FloatingLabel input
                                                paddingLeft: "3rem",
                                                paddingRight: "0.75rem",
                                                borderRadius: "0.375rem", // Border radius to match Bootstrap
                                                border: "1px solid #ced4da", // Bootstrap default border color
                                            }}
                                            buttonStyle={{
                                                backgroundColor: "#f8f9fa",
                                                borderRight: "1px solid #ced4da", // Matching border color on dropdown
                                                height: "calc(3.5rem + 2px)", // Match the input height
                                            }}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingCompany" label={<span>Company <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="company"
                                                required
                                                value={formDataEmployee.company_id || ''}
                                                onChange={handleChangeEmployee}
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map(company => (
                                                    <option key={company._id} value={company._id}>
                                                        {company.company_name || ""}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDepartment" label={<span>Department <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="department_id"
                                                required
                                                value={formDataEmployee.department_id || ''}
                                                onChange={handleChangeEmployee}
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map(param => (
                                                    <option key={param._id} value={param._id}>
                                                        {param.name || ""}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDesignation" label={<span>Designation <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="position_id"
                                                required
                                                value={formDataEmployee.position_id || ''}
                                                onChange={handleChangeEmployee}
                                            >
                                                <option value="">Select Designation</option>
                                                {designations.map(param => (
                                                    <option key={param._id} value={param._id}>
                                                        {param.title || ""}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingHireDate" label={<span>Salary <span className="text-danger">*</span></span>}>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter salary"
                                                name="salary"
                                                required
                                                value={formDataEmployee.salary || ""}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingEmployeeType" label={<span>Employee type <span className="text-danger">*</span></span>}>
                                            <Form.Select
                                                name="employee_type"
                                                value={formDataEmployee.employee_type || ''}
                                                onChange={handleChangeEmployee}
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Contract">Contract</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingPassportNumber" label="Passport Number">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Passport Number"
                                                name="passport_number"
                                                value={formDataEmployee.passport_number || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingIdNumber" label="ID Number">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter ID Number"
                                                name="id_number"
                                                value={formDataEmployee.id_number || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingBirthPlace" label="Birth Place">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Birth Place"
                                                name="birth_place"
                                                value={formDataEmployee.birth_place || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="detailInfo" title="Detail Info">
                                <Row className='g-3'>
                                    {/* Foreigner */}
                                    <Col md={4}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Foreigner"
                                            name="foreigner"
                                            value={formDataEmployee.foreigner || false}
                                            onChange={handleChangeEmployee}
                                        />
                                    </Col>

                                    {/* Smoker */}
                                    <Col md={4}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Smoker"
                                            name="smoker"
                                            value={formDataEmployee.smoker || false}
                                            onChange={handleChangeEmployee}
                                        />
                                    </Col>

                                    {/* Disability */}
                                    <Col md={4}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Disability"
                                            name="disability"
                                            value={formDataEmployee.disability || false}
                                            onChange={handleChangeEmployee}
                                        />
                                    </Col>

                                    {/* Religion */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingReligion" label="Religion">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Religion"
                                                name="religion"
                                                value={formDataEmployee.religion || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Marital Status */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingMaritalStatus" label="Marital Status">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Marital Status"
                                                name="marital_status"
                                                value={formDataEmployee.marital_status || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Dependents */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDependents" label="Dependents">
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter Number of Dependents"
                                                name="dependents"
                                                value={formDataEmployee.dependents || ""}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* First Language */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingFirstLanguage" label="First Language">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter First Language"
                                                name="first_language"
                                                value={formDataEmployee.first_language || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Second Language */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingSecondLanguage" label="Second Language">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Second Language"
                                                name="second_language"
                                                value={formDataEmployee.second_language || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Degree */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingDegree" label="Degree">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Degree"
                                                name="degree"
                                                value={formDataEmployee.degree || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Entity */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingEntity" label="Entity">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Entity"
                                                name="entity"
                                                value={formDataEmployee.entity || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Job */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingJob" label="Job Title">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Job Title"
                                                name="job"
                                                value={formDataEmployee.job || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Work Calendar */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingWorkCalendar" label="Work Calendar">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Work Calendar"
                                                name="work_calendar"
                                                value={formDataEmployee.work_calendar || ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Seniority Date */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingSeniorityDate" label="Seniority Date">
                                            <Form.Control
                                                type="date"
                                                name="seniority_date"
                                                value={formDataEmployee.seniority_date ? formDataEmployee.seniority_date.substring(0, 10) : ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Effective Date */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingEffectiveDate" label="Effective Date">
                                            <Form.Control
                                                type="date"
                                                name="effective_date"
                                                value={formDataEmployee.effective_date ? formDataEmployee.effective_date.substring(0, 10) : ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Job Expiry Date */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingJobExpiryDate" label="Job Expiry Date">
                                            <Form.Control
                                                type="date"
                                                name="job_expiry_date"
                                                value={formDataEmployee.job_expiry_date ? formDataEmployee.job_expiry_date.substring(0, 10) : ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>

                                    {/* Termination Date */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingTerminationDate" label="Termination Date">
                                            <Form.Control
                                                type="date"
                                                name="termination_date"
                                                value={formDataEmployee.termination_date ? formDataEmployee.termination_date.substring(0, 10) : ''}
                                                onChange={handleChangeEmployee}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="photoInfo" title="Photo Info">
                                <Row>
                                    <Col md={2}>
                                        <label className='mb-2'>Image</label>
                                        <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrl('image', url)} existingImageUrl={formDataEmployee.image} isDelete={isDeleteImage} />
                                    </Col>
                                    <Col md={2}>
                                        <label className='mb-2'>ID Front</label>
                                        <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrl('id_front', url)} existingImageUrl={formDataEmployee.id_front} isDelete={isDeleteImage} />
                                    </Col>
                                    <Col md={2}>
                                        <label className='mb-2'>ID Back</label>
                                        <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrl('id_back', url)} existingImageUrl={formDataEmployee.id_back} isDelete={isDeleteImage} />
                                    </Col>
                                    <Col md={2}>
                                        <label className='mb-2'>Passport Front</label>
                                        <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrl('passport_front', url)} existingImageUrl={formDataEmployee.passport_front} isDelete={isDeleteImage} />
                                    </Col>
                                    <Col md={2}>
                                        <label className='mb-2'>Passport Back</label>
                                        <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrl('passport_back', url)} existingImageUrl={formDataEmployee.passport_back} isDelete={isDeleteImage} />
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                        <Button variant="primary" type="submit" disabled={loading} className='my-3'>
                            {loading ? 'Saving...' : employeeId ? 'Save & change' : 'Save employee'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default Employees;
