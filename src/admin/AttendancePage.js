import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import AddAttendanceModal from "../components/AddAttendanceModal";
import AttendanceTable from "../components/AttendanceTable";
import { getDepartments } from "../services/departmentService";
import Select from 'react-select';

const AttendancePage = () => {
    const [filter, setFilter] = useState({ date: "", department: "", status: "" });
    const [showModal, setShowModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [refreshTable, setRefreshTable] = useState(false);

    useEffect(() => {
        fetchDepartment();
    }, []);

    // Function to fetch designations
    const fetchDepartment = async () => {
        try {
            const response = await getDepartments(); // Adjust this function as needed
            setDepartments(response); // Assuming response is an array of company names or objects with name properties
        } catch (err) {
            console.error("Error fetching department:", err.response.data.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    // Transform department data for react-select format
    const departmentOptions = departments.map(param => ({
        value: param.name,
        label: param.name || "",
    }));

    // Handle select change
    const handleSelectChange = (selectedOption) => {
        const event = {
            target: {
                name: "department",
                value: selectedOption ? selectedOption.value : "",
            },
        };
        handleFilterChange(event);
    };

    const handleModalSuccess = () => {
        setRefreshTable((prev) => !prev); // Toggle state to trigger re-render
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <h3 className="mb-4">Attendance Management</h3>
                    <Card>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={3}>
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={filter.date}
                                        onChange={handleFilterChange}
                                        placeholder="Select Date"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Select
                                        name="department"
                                        value={
                                            filter.department ? departmentOptions.find(option => option.value === filter.department) : null
                                        }
                                        onChange={handleSelectChange}
                                        options={departmentOptions}
                                        placeholder="Select Department"
                                        isClearable
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Select
                                        name="status"
                                        value={filter.status}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Present">Present</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Leave">Leave</option>
                                    </Form.Select>
                                </Col>
                                <Col md={3} className="text-end">
                                    <Button variant="primary" onClick={() => setShowModal(true)}>
                                        Add Attendance
                                    </Button>
                                </Col>
                            </Row>
                            <AttendanceTable filters={filter} refresh={refreshTable} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <AddAttendanceModal show={showModal} onHide={() => setShowModal(false)} onSuccess={handleModalSuccess} />
        </Container>
    );
};

export default AttendancePage;
