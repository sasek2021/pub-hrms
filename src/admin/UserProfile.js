import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image, Table, Ratio } from "react-bootstrap";
import Swal from "sweetalert2";
import { getCompanyByID } from "../services/companyService";

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        // Fetch user data from localStorage or API
        const loggedInUser = JSON.parse(localStorage.getItem("userActive")) || {};
        fetchCompanyByID(loggedInUser?.company_id);
        setUser(loggedInUser);
    }, []);

    const fetchCompanyByID = async (companyID) => {
        try {
            const response = await getCompanyByID(companyID); // Adjust this function as needed
            setCompanyName(response?.company_name);
            return response?.company_name;
            console.log(response);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: `An error occurred: ${err.response.data.message}`,
                confirmButtonText: "OK"
            });
        }
    };

    return (
        <Container className="py-4">
            <Row className="g-3">
                {/* Profile Picture and Basic Details */}
                <Col md={4}>
                    <Card>
                        <Card.Body className="text-center">
                            <Row>
                                <Col md={6} className="mx-auto">
                                    <Ratio aspectRatio="1x1">
                                        <Image
                                            src={user.image || "https://via.placeholder.com/150"}
                                            roundedCircle
                                            alt="Profile"
                                        />
                                    </Ratio>
                                </Col>
                            </Row>
                            <h4 className="mt-3">{user.first_name || "N/A"}</h4>
                            <p className="text-muted">{user.role || "Role not assigned"}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Detailed Information */}
                <Col md={8}>
                    <Card>
                        <Card.Header>User Details</Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive className="mb-0">
                                <tbody>
                                    <tr>
                                        <th>Username</th>
                                        <td>{user.username || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{user.email || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th>Company</th>
                                        <td>{companyName || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th>Account Locked</th>
                                        <td>{user.account_locked ? "Yes" : "No"}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>{user.status || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th>Date of Birth</th>
                                        <td>{user.date_of_birth || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th>Created At</th>
                                        <td>{new Date(user.createdAt).toLocaleString() || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th>Updated At</th>
                                        <td>{new Date(user.updatedAt).toLocaleString() || "N/A"}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
