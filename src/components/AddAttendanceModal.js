import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from 'react-select';
import { getEmployees } from "../services/employeeService";
import { getFullName } from "../utils/getFullName";
import { createAttendance } from "../services/attendanceService";
import Swal from "sweetalert2";

const AddAttendanceModal = ({ show, onHide, onSuccess, data }) => {
    const [filter, setFilter] = useState({ date: "", employee: "", status: "" });
    const [employees, setEmployees] = useState([]);
    const [attendanceId, setAttendanceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ date: "", employee_id: "", status: "" });

    useEffect(() => {
        fetchEmployee();
    }, []);

    useEffect(() => {
        console.log("data>>", data);
        const formatData = {
            date: data?.date, 
            employee_id: data?.employee_id?._id, 
            status: data?.status
        }
        setFormData(formatData);
    }, [data]);

    // useEffect(() => {
    //     if (!show) {
    //         setFormData(data);
    //         setAttendanceId(null);
    //     }
    // }, [show]);  

    // useEffect(() => {
    //     console.log("data>>>", data);
    //     setFilter(data);
    // }, [data]);

    // Function to fetch designations
    const fetchEmployee = async () => {
        try {
            const response = await getEmployees(); // Adjust this function as needed
            setEmployees(response); // Assuming response is an array of company names or objects with name properties
        } catch (err) {
            console.error("Error fetching employee:", err.response.data.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    // Transform employee data for react-select format
    const employeeOptions = employees.map(param => ({
        value: param?._id,
        label: getFullName(param) || "",
    }));

    // Handle select change
    const handleSelectChange = (selectedOption) => {
        const event = {
            target: {
                name: "employee_id",
                value: selectedOption ? selectedOption.value : "",
            },
        };
        // Update the form data state
        setFormData((prevFormData) => ({
            ...prevFormData, // Spread existing state
            employee_id: event.target.value, // Update the 'employee_id' field
        }));
        handleFilterChange(event);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (attendanceId) {
                await createAttendance(formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Attendance updated successfully!',
                    confirmButtonText: 'OK',
                });
            } else {
                await createAttendance(formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Attendance created successfully!',
                    confirmButtonText: 'OK',
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: `An error occurred: ${err.response.data.message || err.response.data.error}`,
                confirmButtonText: "OK"
            });
        } finally {
            onSuccess(); // Notify parent of success
            setLoading(false);
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add Attendance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Employee</Form.Label>
                        <Select
                            name="employee_id"
                            value={
                                filter.employee_id ? employeeOptions.find(option => option.value === filter?._id) : null
                            }
                            onChange={handleSelectChange}
                            options={employeeOptions}
                            placeholder="Select employee"
                            isClearable
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Leave">Leave</option>
                        </Form.Select>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading} className='my-3'>
                        {loading ? 'Saving...' : attendanceId ? 'Save & change' : 'Save'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAttendanceModal;
