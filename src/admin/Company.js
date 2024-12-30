import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Tabs, Tab, FloatingLabel, Modal, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { createCompany, deleteCompanyByID, getCompanies, getCompanyByID, updateCompanyByID } from '../services/companyService';
import '../styles/CustomTabs.css'; // Create a CSS file for styling
import '../styles/DataGrid.css'; // Create a CSS file for styling
import DatePicker from 'react-datepicker';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { createBranch, updateBranchByID } from '../services/branchService';
import { DataGrid } from "@mui/x-data-grid";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'
import ImageUpload from '../components/ImageUpload';
import { getImageName } from '../utils/GetImageName';
import { deleteImage } from '../services/imageUploadService';
import Placeholder from 'react-bootstrap/Placeholder';
import GridSkeleton from '../components/GridSkeleton';

const CompanyForm = () => {
    const [companyId, setCompanyId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [branches, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [branchID, setBranchID] = useState(null);
    const filteredBranches = branches.filter(branch =>
        branch.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [selectedRows, setSelectedRows] = useState([]);
    const [loadingCompany, setLoadingCompany] = useState(true);
    const [formData, setFormData] = useState({
        icon: '',
        logo: '',
        company_name: '',
        company_address: '',
        work_location: '',
        phone: '',
        website: '',
        email: '',
        social_media: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
        },
        status: 'Active',
        year_founded: '',
        industry: '',
        founder: '',
        parent_company: null,
    });
    const [formDataBranch, setFormDataBranch] = useState({
        icon: '',
        logo: '',
        company_name: '',
        company_address: '',
        work_location: '',
        phone: '',
        website: '',
        email: '',
        social_media: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
        },
        status: 'Active',
        year_founded: '',
        industry: '',
        founder: '',
        parent_company: null,
        icon: '',
        logo: ''
    });
    const [isDeleteImage, setIsDeleteImage] = useState(false);

    const fetchCompanies = async () => {
        try {
            const response = await getCompanies('main'); // Adjust this function as needed
            const company = response; // Assuming response.data is an array
            if (company && company.length > 0) {
                const selectedCompany = company[0];
                const socialMedia = selectedCompany.social_media || {
                    facebook: '',
                    twitter: '',
                    instagram: '',
                    linkedin: '',
                };
                setCompanyId(selectedCompany._id);
                setFormData({
                    icon: selectedCompany.icon || '',
                    logo: selectedCompany.logo || '',
                    company_name: selectedCompany.company_name || '',
                    company_address: selectedCompany.company_address || '',
                    work_location: selectedCompany.work_location || '',
                    phone: selectedCompany.phone || '',
                    website: selectedCompany.website || '',
                    email: selectedCompany.email || '',
                    social_media: {
                        facebook: socialMedia.facebook || '',
                        twitter: socialMedia.twitter || '',
                        instagram: socialMedia.instagram || '',
                        linkedin: socialMedia.linkedin || '',
                    },
                    status: selectedCompany.status || 'Active',
                    year_founded: selectedCompany.year_founded || '',
                    industry: selectedCompany.industry || '',
                    founder: selectedCompany.founder || '',
                    parent_company: selectedCompany.parent_company || null
                });
            }
            setLoadingCompany(false);
        } catch (err) {
            setError(err.message);
            setLoadingCompany(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await getCompanies('branch'); // Adjust this function as needed
            setBranches(response)
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchCompanies();
        fetchBranches();
    }, []);

    // const handleYearChange = (date) => {
    //     setFormData({ ...formData, year_founded: date.getFullYear() });
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleChangePhone = (phone, countryData) => {
        setFormData(prevData => ({
            ...prevData,
            phone: phone, // New phone value
            country: countryData.name // Ensure country data is being accessed correctly
        }));
    };

    const handleSocialMediaChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            social_media: {
                ...prevData.social_media,
                [name]: value,
            },
        }));
    };

    const handleImageUrlCompany = (field, url) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: url, // Update the specific field with the URL
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (companyId) {
                await updateCompanyByID(companyId, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Company updated successfully!',
                    confirmButtonText: 'OK',
                });
            } else {
                const response = await createCompany(formData);
                setCompanyId(response._id);
                setFormData(response);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Company created successfully!',
                    confirmButtonText: 'OK',
                });
            }
            setIsDeleteImage(true); // delete icon and logo when sumit update company
            // Clear form or redirect here if needed
        } catch (err) {
            setError(err.response.data.message || err.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBranch = () => {
        setShowModal(true);
        setIsEditing(false);
        const socialMedia = {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
        };
        setFormDataBranch({
            icon: '',
            logo: '',
            company_name: '',
            company_address: '',
            work_location: '',
            phone: '',
            website: '',
            email: '',
            social_media: {
                facebook: socialMedia.facebook || '',
                twitter: socialMedia.twitter || '',
                instagram: socialMedia.instagram || '',
                linkedin: socialMedia.linkedin || '',
            },
            status: 'Active',
            year_founded: '',
            industry: '',
            founder: '',
            parent_company: null,
        });
    };

    const handleUpdateBranch = (branch) => {
        if (branch._id) {
            setBranchID(branch._id);
            const socialMedia = branch.social_media || {
                facebook: '',
                twitter: '',
                instagram: '',
                linkedin: '',
            };
            setFormDataBranch({
                icon: branch.icon || '',
                logo: branch.logo || '',
                company_name: branch.company_name || '',
                company_address: branch.company_address || '',
                work_location: branch.work_location || '',
                phone: branch.phone || '',
                website: branch.website || '',
                email: branch.email || '',
                social_media: {
                    facebook: socialMedia.facebook || '',
                    twitter: socialMedia.twitter || '',
                    instagram: socialMedia.instagram || '',
                    linkedin: socialMedia.linkedin || '',
                },
                status: branch.status || 'Active',
                year_founded: branch.year_founded || '',
                industry: branch.industry || '',
                founder: branch.founder || '',
                parent_company: branch.parent_company || null,
                icon: branch?.icon || '',
                logo: branch?.logo || ''
            });
        }
        // setFormDataBranch({ id: branch._id, company_name: branch.company_name });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteBranch = async (item) => {
        try {
            const result = await Swal.fire({
                title: "Confirm Deletion",
                text: `Are you sure you want to delete the branch "${item?.company_name}"? This action cannot be undone.`,
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
                    item?.icon,
                    item?.logo,
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

                await deleteCompanyByID(item?._id); // Perform the deletion

                Swal.fire({
                    title: "Deleted!",
                    text: "The branch has been deleted successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                fetchBranches(); // Refresh branches
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Deletion Failed",
                text: `An error occurred: ${error.message}`,
                confirmButtonText: "OK"
            });
        }
    };


    const handleCloseBranch = () => setShowModal(false);

    const handleChangeBranch = (e) => {
        const { name, value } = e.target;
        setFormDataBranch((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleBranchChangePhone = (phone, countryData) => {
        setFormDataBranch(prevData => ({
            ...prevData,
            phone: phone, // New phone value
            country: countryData.name // Ensure country data is being accessed correctly
        }));
    };
    const handleKeyDown = (event) => {
        // Check if the first character is '0' and if it's the first key pressed
        if (formDataBranch?.phone?.length === 0 && event?.key === '0') {
            event.preventDefault(); // Prevent '0' from being entered at the start
        }
    };


    const handleSocialMediaChangeBranch = (e) => {
        const { name, value } = e.target;
        setFormDataBranch((prevData) => ({
            ...prevData,
            social_media: {
                ...prevData.social_media,
                [name]: value,
            },
        }));
    };

    // Updated handleImageUrl function
    const handleImageUrl = (field, url) => {
        setFormDataBranch((prevData) => ({
            ...prevData,
            [field]: url, // Update the specific field with the URL
        }));
    };

    const handleSubmitBranch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing) {
                await updateBranchByID(branchID, formDataBranch);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Branch updated successfully!',
                    confirmButtonText: 'OK',
                });
                fetchBranches();
            } else {
                setFormDataBranch((prevData) => ({
                    ...prevData,
                    parent_company: companyId,
                }));
                // Create a new object with `parent_company` set
                const updatedFormDataBranch = { ...formDataBranch, parent_company: companyId };
                await createBranch(updatedFormDataBranch);
                fetchBranches();
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Branch created successfully!',
                    confirmButtonText: 'OK',
                });
            }
            setIsDeleteImage(true);
            // Clear form and close modal
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAllDeleteBranch = async () => {
        try {
            const result = await Swal.fire({
                title: "Confirm Multiple Deletion",
                text: `Delete ${selectedRows.length} selected branches?`,
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
                    const branchesById = await Promise.all(selectedRows.map(id => getCompanyByID(id)));

                    // Collect valid image URLs to delete
                    const validImageFields = branchesById.flatMap(item => {
                        return [item?.icon, item?.logo].filter(Boolean); // Filters out null/undefined
                    });

                    // Delete images concurrently
                    await Promise.all(validImageFields.map(async (existingImageUrl) => {
                        const imageName = getImageName(existingImageUrl);
                        await deleteImage(imageName); // Ensure images are deleted asynchronously
                    }));

                } catch (imageDeletionError) {
                    console.error('Error deleting images:', imageDeletionError);
                }

                await Promise.all(selectedRows.map(id => deleteCompanyByID(id)));
                fetchBranches();
                setSelectedRows([]);
                Swal.fire("Deleted!", "Selected branches deleted.", "success");
            }
        } catch (error) {
            Swal.fire("Error", `Failed to delete multiple: ${error.message}`, "error");
        }
    };

    const columns = [
        { field: "company_name", headerName: "Name", flex: 1 },
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
        { field: "phone", headerName: "Phone", flex: 1 },
        { field: "email", headerName: "Email", flex: 1.4 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.6,
            renderCell: (params) => (
                <div className='h-100 d-flex align-items-center g-2' style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleUpdateBranch(params.row)}
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteBranch(params?.row)}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            {/* <h2>{companyId ? 'Edit Company' : 'Add New Company'}</h2> */}
            {error && <div className="alert alert-danger">{error}</div>}
            {loadingCompany ? (
                <GridSkeleton count={6} col={4} />
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Tabs defaultActiveKey="companyInfo" id="company-info-tabs" className="mb-3 custom-tabs">
                        <Tab eventKey="companyInfo" title="Company Info">
                            <Row className='g-3'>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingCompanyName" label="Company Name (required)">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter company name"
                                            name="company_name"
                                            required
                                            value={formData.company_name || ''} // Ensure it is always defined
                                            onChange={handleChange} />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingSelect" label="Status (required)">
                                        <Form.Select
                                            aria-label="Select status"
                                            name="status"
                                            required
                                            value={formData.status || ''} // Ensure it is always defined
                                            onChange={handleChange}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingCompanyAddress" label="Company Address">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter company address"
                                            name="company_address"
                                            value={formData.company_address || ''} // Ensure it is always defined
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingWorkLocation" label="Work Location">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter work location"
                                            name="work_location"
                                            value={formData.work_location || ''} // Ensure it is always defined
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                                {/* <Col md={4}>
                                <DatePicker
                                    selected={formData.year_founded ? new Date(formData.year_founded, 0, 1) : null}
                                    onChange={handleYearChange}
                                    showYearPicker
                                    dateFormat="yyyy"
                                    className="form-control"
                                    placeholderText="YYYY"
                                />
                            </Col> */}
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingIndustry" label="Industry">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter industry"
                                            name="industry"
                                            value={formData.industry || ''} // Ensure it is always defined
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingFounder" label="Founder">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter founder(s)"
                                            name="founder"
                                            value={formData.founder || ''} // Ensure it is always defined
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="contactInfo" title="Contact Info">
                            <Row className='g-3'>
                                <Col md={4}>
                                    <PhoneInput
                                        enableSearch
                                        country={"kh"} // Default country code
                                        value={formData.phone}
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
                                    <FloatingLabel controlId="floatingWebsite" label="Website">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter website URL"
                                            name="website"
                                            value={formData.website || ''} // Ensure it is always defined
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingEmail" label="Email">
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            name="email"
                                            value={formData.email || ''} // Ensure it is always defined
                                            onChange={handleChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="socialMedia" title="Social Media">
                            <Row className='g-3'>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingFacebook" label="Facebook">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Facebook link"
                                            name="facebook"
                                            value={formData.social_media.facebook || ''} // Ensure it is always defined
                                            onChange={handleSocialMediaChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingTwitter" label="Twitter">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Twitter link"
                                            name="twitter"
                                            value={formData.social_media.twitter || ''} // Ensure it is always defined
                                            onChange={handleSocialMediaChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingInstagram" label="Instagram">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Instagram link"
                                            name="instagram"
                                            value={formData.social_media.instagram || ''} // Ensure it is always defined
                                            onChange={handleSocialMediaChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingLinkedIn" label="LinkedIn">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter LinkedIn link"
                                            name="linkedin"
                                            value={formData.social_media.linkedin || ''} // Ensure it is always defined
                                            onChange={handleSocialMediaChange}
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="companyLogo" title="Logo">
                            <Row>
                                <Col md={2}>
                                    <label className='mb-2'>Icon</label>
                                    <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrlCompany('icon', url)} existingImageUrl={formData?.icon} isDelete={isDeleteImage} />
                                </Col>
                                <Col md={2}>
                                    <label className='mb-2'>Logo</label>
                                    <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrlCompany('logo', url)} existingImageUrl={formData?.logo} isDelete={isDeleteImage} />
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>

                    <Button variant="primary" type="submit" disabled={loading} className='my-3'>
                        {loading ? 'Saving...' : companyId ? 'Save & change' : 'Save company'}
                    </Button>
                </Form>
            )}

            <div className="border-top">
                <div className="d-flex justify-content-between align-items-center my-2">
                    <h6 className="m-0">{filteredBranches.length} Branches</h6>
                    <button className="btn btn-primary btn-sm d-flex align-items-center"
                        disabled={!companyId} // Disable button if companyId is falsy
                        onClick={handleAddBranch}>
                        <FaPlus className="me-1" /> Add Branch
                    </button>
                </div>
                <Row>
                    <Col md="12">
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search branches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Col>
                </Row>

                {selectedRows.length > 0 && (
                    <button
                        className="btn btn-danger btn-sm mb-3 d-flex align-items-center"
                        onClick={handleSelectAllDeleteBranch}
                    >
                        <FaTrash className="pe-1" /> Delete Selected
                    </button>
                )}

                <div style={{ height: 371, width: "100%" }}>
                    <DataGrid
                        loading={loadingCompany}
                        rows={filteredBranches}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        getRowId={(row) => row._id}
                        checkboxSelection
                        disableSelectionOnClick={false}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setSelectedRows(newRowSelectionModel);
                        }}
                        // selectedRows={selectedRows}
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
            </div> {/* Branch data */}

            <Modal size="lg" show={showModal} onHide={handleCloseBranch}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Branch' : 'Add branch'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitBranch}>
                        <Tabs defaultActiveKey="companyInfo" id="company-info-tabs" className="mb-3 custom-tabs">
                            <Tab eventKey="companyInfo" title="Branch Info">
                                <Row className='g-3'>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingCompanyName" label="Company Name (required)">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter company name"
                                                name="company_name"
                                                required
                                                value={formDataBranch.company_name || ''} // Ensure it is always defined
                                                onChange={handleChangeBranch} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingSelect" label="Status (required)">
                                            <Form.Select
                                                aria-label="Select status"
                                                name="status"
                                                required
                                                value={formDataBranch.status || ''} // Ensure it is always defined
                                                onChange={handleChangeBranch}
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingCompanyAddress" label="Company Address">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter company address"
                                                name="company_address"
                                                value={formDataBranch.company_address || ''} // Ensure it is always defined
                                                onChange={handleChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingWorkLocation" label="Work Location">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter work location"
                                                name="work_location"
                                                value={formDataBranch.work_location || ''} // Ensure it is always defined
                                                onChange={handleChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    {/* <Col md={4}>
                                <DatePicker
                                    selected={formDataBranch.year_founded ? new Date(formDataBranch.year_founded, 0, 1) : null}
                                    onChange={handleYearChange}
                                    showYearPicker
                                    dateFormat="yyyy"
                                    className="form-control"
                                    placeholderText="YYYY"
                                />
                            </Col> */}
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingIndustry" label="Industry">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter industry"
                                                name="industry"
                                                value={formDataBranch.industry || ''} // Ensure it is always defined
                                                onChange={handleChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingFounder" label="Founder">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter founder(s)"
                                                name="founder"
                                                value={formDataBranch.founder || ''} // Ensure it is always defined
                                                onChange={handleChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="contactInfo" title="Contact Info">
                                <Row className='g-3'>
                                    <Col md={4}>
                                        <PhoneInput
                                            enableSearch
                                            country={"kh"} // Default country code
                                            value={formDataBranch.phone}
                                            onChange={handleBranchChangePhone} // Pass the phone value directly
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
                                        <FloatingLabel controlId="floatingWebsite" label="Website">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter website URL"
                                                name="website"
                                                value={formDataBranch.website || ''} // Ensure it is always defined
                                                onChange={handleChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingEmail" label="Email">
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email"
                                                name="email"
                                                value={formDataBranch.email || ''} // Ensure it is always defined
                                                onChange={handleChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="socialMedia" title="Social Media">
                                <Row className='g-3'>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingFacebook" label="Facebook">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Facebook link"
                                                name="facebook"
                                                value={formDataBranch.social_media.facebook || ''} // Ensure it is always defined
                                                onChange={handleSocialMediaChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingTwitter" label="Twitter">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Twitter link"
                                                name="twitter"
                                                value={formDataBranch.social_media.twitter || ''} // Ensure it is always defined
                                                onChange={handleSocialMediaChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingInstagram" label="Instagram">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Instagram link"
                                                name="instagram"
                                                value={formDataBranch.social_media.instagram || ''} // Ensure it is always defined
                                                onChange={handleSocialMediaChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={4}>
                                        <FloatingLabel controlId="floatingLinkedIn" label="LinkedIn">
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter LinkedIn link"
                                                name="linkedin"
                                                value={formDataBranch.social_media.linkedin || ''} // Ensure it is always defined
                                                onChange={handleSocialMediaChangeBranch}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="logoInfo" title="Logo">
                                <Row>
                                    <Col md={2}>
                                        <label className='mb-2'>Icon</label>
                                        <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrl('icon', url)} existingImageUrl={formDataBranch.icon} isDelete={isDeleteImage} />
                                    </Col>
                                    <Col md={2}>
                                        <label className='mb-2'>Logo</label>
                                        <ImageUpload autoUpload={true} manualUpload={false} onImageUrl={(url) => handleImageUrl('logo', url)} existingImageUrl={formDataBranch.logo} isDelete={isDeleteImage} />
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                        <Button variant="primary" type="submit" disabled={loading} className='my-3'>
                            {loading ? 'Saving...' : companyId ? 'Save & change' : 'Save company'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default CompanyForm;
