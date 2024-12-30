import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams

const ConfirmPassword = () => {
    const { token } = useParams(); // Get the token from URL parameters
    const navigate = useNavigate(); // Initialize the navigate function
    const [new_password, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (new_password !== confirmPassword) {
            Swal.fire({
                title: 'Error!',
                text: 'Passwords do not match!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password/${token}`, {
                new_password,
            });

            if (response.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your password has been reset successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    // Navigate to the login page after the alert is confirmed
                    navigate('/login');
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to reset password!',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="row w-100">
                <div className="offset-2 col-md-8 my-auto">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="text-center">Reset Password</h2>
                            <form onSubmit={handlePasswordReset}>
                                <div className="form-group mb-3">
                                    <label htmlFor="new_password">New Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="new_password"
                                        value={new_password}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="confirmPassword">Confirm Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                    {loading ? (
                                        <>
                                            Sending Reset Link
                                            <span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPassword;
