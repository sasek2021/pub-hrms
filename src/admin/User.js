import React, { useState, useEffect } from 'react';
import { changePasswordUserByID, createUser, deleteUserByID, getUserByID, getUsers, updateUserByID } from '../services/userService';
import { FaEdit, FaEye, FaEyeSlash, FaPlus, FaTrash } from 'react-icons/fa'; // Ensure to install react-icons
import { DataGrid } from '@mui/x-data-grid'; // Ensure you have @mui/x-data-grid installed
import { Row, Col, Modal, Form, Tabs, Tab, FloatingLabel, Button, InputGroup } from 'react-bootstrap'; // Ensure you have react-bootstrap installed
import Swal from 'sweetalert2';
import PhoneInput from 'react-phone-input-2';
import { getCompanies } from '../services/companyService';
import ImageUpload from '../components/ImageUpload';
import { getImageName } from '../utils/GetImageName';
import { deleteImage } from '../services/imageUploadService';

const User = () => {
    const [users, setUsers] = useState([]); // State to hold all users
    const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
    const [searchTerm, setSearchTerm] = useState(''); // State for search input
    const [selectedRows, setSelectedRows] = useState([]); // State for selected rows
    const [userId, setUserId] = useState(null); // Example state for companyId
    const [showModal, setShowModal] = useState(false);
    const handleCloseUser = () => setShowModal(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [companies, setCompanies] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('userActive')); // Retrieve current user ID from storage
    const [isDeleteImage, setIsDeleteImage] = useState(false);
    const [userActive, setUserActive] = useState({});
    const [formDataUser, setFormDataUser] = useState({
        username: '',
        password_hash: '',
        role: '',
        status: '',
        company_id: '',
        profile_picture_url: '',
        first_name: '',
        last_name: '',
        status: 'Active',
        date_of_birth: '',
        phone: '',
        email: '',
        image: ''
    });
    const [formDataUserChangePassword, setFormDataUserChangePassword] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const fetchUsers = async () => {
        try {
            const userRole = JSON.parse(localStorage.getItem('userActive'));
            if (userRole?.role === 'Manager') {
                // Managers can fetch all users
                const response = await getUsers(); // Adjust this function as needed
                setUsers(response);
                setFilteredUsers(response); // Set initial filtered users to all users
            } else {
                // Non-Managers can only fetch their own user data
                const response = await getUserByID(currentUser?._id); // Adjust this function as needed
                setUsers([response]); // Wrap in an array to maintain consistent structure
                setFilteredUsers([response]); // Set filtered users to the current user only
            }
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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userActive'));
        setUserActive(user);
        fetchUsers();
        fetchCompanies();
    }, []);

    useEffect(() => {
        // Filter users based on search term
        setFilteredUsers(
            users.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, users]);

    const handleAddUser = () => {
        setUserId('');
        setFormDataUser({
            username: '',
            password_hash: '',
            role: 'Employee',
            status: '',
            company_id: '',
            profile_picture_url: '',
            first_name: '',
            last_name: '',
            status: 'Active',
            date_of_birth: '',
            phone: '',
            email: '',
            image: ''
        });

        setShowModal(true);
    };

    const handleSelectAllDeleteUsers = async () => {
        try {
            const result = await Swal.fire({
                title: "Confirm Multiple Deletion",
                text: `Delete ${selectedRows.length} selected users?`,
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
                try {
                    // Fetch branch details for each selected row
                    const selectedById = await Promise.all(selectedRows.map(id => getUserByID(id)));

                    // Collect valid image URLs to delete
                    const validImageFields = selectedById.flatMap(item => {
                        return [item?.image].filter(Boolean); // Filters out null/undefined
                    });

                    // Delete images concurrently
                    await Promise.all(validImageFields.map(async (existingImageUrl) => {
                        const imageName = getImageName(existingImageUrl);
                        await deleteImage(imageName); // Ensure images are deleted asynchronously
                    }));

                } catch (imageDeletionError) {
                    console.error('Error deleting images:', imageDeletionError);
                }
                await Promise.all(selectedRows.map(id => deleteUserByID(id)));
                fetchUsers();
                setSelectedRows([]);
                Swal.fire("Deleted!", "Selected users deleted.", "success");
            }
        } catch (err) {
            Swal.fire("Error", `Failed to delete multiple: ${err.response.data.message}`, "error");
        }
    };

    const columns = [
        { field: 'first_name', headerName: 'First name', flex: 1 },
        {
            field: 'role',
            headerName: 'Role',
            flex: 1,
            renderCell: (params) => {
                const roleClassMap = {
                    'Manager': 'text-primary',
                    'Admin': 'text-info',
                    'Employee': 'text-secondary',
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
                            onClick={() => handleUpdateUser(params.row)}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(params.row)}
                            disabled={params.row._id === currentUser?._id} // Disable if it's the current user
                        >
                            <FaTrash />
                        </button>
                    </div>
                );
            },
        },
    ];


    const handleUpdateUser = (user) => {
        if (user._id) {
            setUserId(user._id);
            setFormDataUser({
                username: user.username || '',
                role: user.role || '',
                status: user.status || '',
                company_id: user.company_id || '',
                profile_picture_url: user.profile_picture_url || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                status: user.status || '',
                date_of_birth: user.date_of_birth || '',
                phone: user.phone || '',
                email: user.email || '',
                image: user.image || ''
            });
        }
        setShowModal(true);
    };

    const handleDeleteUser = async (item) => {
        try {
            const result = await Swal.fire({
                title: "Confirm Deletion",
                text: `Are you sure you want to delete the user "${item?.first_name}"? This action cannot be undone.`,
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

                await deleteUserByID(item?._id); // Perform the deletion

                Swal.fire({
                    title: "Deleted!",
                    text: "The branch has been deleted successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                fetchUsers(); // Refresh branches
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

    const handleImageUrl = (field, url) => {
        setFormDataUser((prevData) => ({
            ...prevData,
            [field]: url, // Update the specific field with the URL
        }));
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Check if userId exists for update logic
            if (userId) {
                // Update user information
                await updateUserByID(userId, formDataUser);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User updated successfully!',
                    confirmButtonText: 'OK',
                });
            } else {
                // Create user logic
                await createUser(formDataUser);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User created successfully!',
                    confirmButtonText: 'OK',
                });
            }

            // Check if password change fields are filled
            if (formDataUserChangePassword.current_password &&
                formDataUserChangePassword.new_password &&
                formDataUserChangePassword.confirm_password) {

                // Validate if new password matches confirmation
                if (formDataUserChangePassword.new_password !== formDataUserChangePassword.confirm_password) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Password Change Failed',
                        text: 'New password and confirmation password do not match.',
                        confirmButtonText: 'OK',
                    });
                    return; // Exit early if passwords do not match
                }

                // Optionally add additional validation for password strength here

                // Proceed with password change
                await changePasswordUserByID(userId, formDataUserChangePassword);
                setFormDataUserChangePassword({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                })
            }
            setIsDeleteImage(true);
            // Fetch users if necessary
            fetchUsers();

            // Clear form and close modal
            setShowModal(false);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: `An error occurred: ${err.response.data.message}`,
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };


    const handleChangeUser = (e) => {
        const { name, value } = e.target;
        setFormDataUser((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleChangeUserChangePS = (e) => {
        const { name, value } = e.target;
        setFormDataUserChangePassword((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleChangePhone = (phone, countryData) => {
        setFormDataUser(prevData => ({
            ...prevData,
            phone, // New phone value
            country: countryData.name // Ensure country data is being accessed correctly
        }));
    };
    const handleKeyDown = (event) => {
        // Check if the first character is '0' and if it's the first key pressed
        if (formDataUser.phone.length === 0 && event.key === '0') {
            event.preventDefault(); // Prevent '0' from being entered at the start
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <>
            <div>
                <div className="d-flex justify-content-between align-items-center my-2">
                    <h6 className="m-0">{filteredUsers.length} Users</h6>
                    {userActive?.role === 'Manager' && (
                        <button className="btn btn-primary btn-sm d-flex align-items-center"
                            onClick={handleAddUser}>
                            <FaPlus className="me-1" /> Add user
                        </button>
                    )}
                </div>
                <Row>
                    <Col md="12">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                </Row>

                {selectedRows.length > 0 && (
                    <button
                        className="btn btn-danger btn-sm mb-3 d-flex align-items-center"
                        onClick={handleSelectAllDeleteUsers}
                    >
                        <FaTrash className="pe-1" /> Delete Selected
                    </button>
                )}

                <div style={{ height: 371, width: "100%" }}>
                    <DataGrid
                        rows={filteredUsers}
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
                        // Disable row selection for the current user
                        isRowSelectable={(params) => params.row._id !== currentUser?._id}
                    />
                </div>
            </div> {/* User data */}

            <Modal size="lg" show={showModal} onHide={handleCloseUser}>
                <Modal.Header closeButton>
                    <Modal.Title>{userId ? 'Edit user' : 'Add user'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitUser}>
                        <Tabs defaultActiveKey="userInfo" id="user-info-tabs" className="mb-3 custom-tabs">
                            <Tab eventKey="userInfo" title="User Info">
                                <Row className='g-3'>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingUserName" label="Username (required)">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter username"
                                                name="username"
                                                required
                                                value={formDataUser.username || ''} // Ensure it is always defined
                                                onChange={handleChangeUser} />
                                        </FloatingLabel>
                                    </Col>
                                    {!userId && (
                                        <Col md={4}>
                                            <FloatingLabel controlId="floatingPassword" label="Password (required)" className="position-relative">
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"} // Toggle input type
                                                    placeholder="Enter password"
                                                    name="password_hash"
                                                    required
                                                    value={formDataUser.password_hash || ''}
                                                    onChange={handleChangeUser}
                                                />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    style={{ cursor: "pointer", transform: "translateY(-50%)" }}
                                                    className="position-absolute end-0 top-50 me-3"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                            </FloatingLabel>
                                        </Col>
                                    )}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingSelect" label="Status (required)">
                                            <Form.Select
                                                aria-label="Select status"
                                                name="status"
                                                required
                                                value={formDataUser.status || ''} // Ensure it is always defined
                                                onChange={handleChangeUser}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingCompany" label="Company (required)">
                                            <Form.Select
                                                aria-label="Select company"
                                                name="company_id"
                                                required
                                                value={formDataUser?.company_id || ''}
                                                onChange={handleChangeUser}
                                            >
                                                <option value="">Select a company</option>
                                                {Array.isArray(companies) && companies?.map((company, index) => (
                                                    <option key={index} value={company?._id}>
                                                        {company.company_name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingRole" label="Role (required)">
                                            <Form.Select
                                                aria-label="Select role"
                                                name="role"
                                                required
                                                value={formDataUser.role || ''} // Ensure it is always defined
                                                onChange={handleChangeUser}
                                            >
                                                <option value="Manager">Manager</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Employee">Employee</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingEmail" label="Email (required)">
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                name="email"
                                                required
                                                value={formDataUser.email || ''} // Ensure it is always defined
                                                onChange={handleChangeUser}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <PhoneInput
                                            enableSearch
                                            country={"kh"} // Default country code
                                            value={formDataUser.phone}
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
                                        <FloatingLabel controlId="floatingFirstname" label="First name (required)">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter first name"
                                                name="first_name"
                                                required
                                                value={formDataUser.first_name || ''} // Ensure it is always defined
                                                onChange={handleChangeUser}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingLastname" label="Lastname">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter lastname"
                                                name="last_name"
                                                value={formDataUser.last_name || ''} // Ensure it is always defined
                                                onChange={handleChangeUser}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="image" title="Image">
                                <Row className='g-3'>
                                    <Col md={3}>
                                        <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrl('image', url)} existingImageUrl={formDataUser?.image} isDelete={isDeleteImage} />
                                    </Col>
                                </Row>
                            </Tab>

                            {userId && (
                                <Tab eventKey="changePassword" title="Change password Info">
                                    <Row className='g-3'>
                                        <Col md={12}>
                                            <FloatingLabel controlId="floatingPassword" label="Current password (required)" className="position-relative">
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"} // Toggle input type
                                                    placeholder="Enter password"
                                                    name="current_password"
                                                    value={formDataUserChangePassword.current_password || ''}
                                                    onChange={handleChangeUserChangePS}
                                                />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    style={{ cursor: "pointer", transform: "translateY(-50%)" }}
                                                    className="position-absolute end-0 top-50 me-3"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                            </FloatingLabel>
                                        </Col>
                                        <Col md={12}>
                                            <FloatingLabel controlId="floatingPassword" label="New password (required)" className="position-relative">
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"} // Toggle input type
                                                    placeholder="Enter new password"
                                                    name="new_password"
                                                    value={formDataUserChangePassword.new_password || ''}
                                                    onChange={handleChangeUserChangePS}
                                                />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    style={{ cursor: "pointer", transform: "translateY(-50%)" }}
                                                    className="position-absolute end-0 top-50 me-3"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                            </FloatingLabel>
                                        </Col>
                                        <Col md={12}>
                                            <FloatingLabel controlId="floatingPassword" label="Confirm password (required)" className="position-relative">
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"} // Toggle input type
                                                    placeholder="Enter confirm password"
                                                    name="confirm_password"
                                                    value={formDataUserChangePassword.confirm_password || ''}
                                                    onChange={handleChangeUserChangePS}
                                                />
                                                <span
                                                    onClick={togglePasswordVisibility}
                                                    style={{ cursor: "pointer", transform: "translateY(-50%)" }}
                                                    className="position-absolute end-0 top-50 me-3"
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </span>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </Tab>
                            )}
                        </Tabs>
                        <Button variant="primary" type="submit" disabled={loading} className='my-3'>
                            {loading ? 'Saving...' : userId ? 'Save & change' : 'Save user'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default User;
