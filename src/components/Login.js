// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password_hash, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const [loadingFP, setLoadingFP] = useState(false); // Add loading state
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');   
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading spinner
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                username,
                password_hash
            })
            console.log("response>>>", response);
            // Save the JWT token in localStorage or sessionStorage
            localStorage.setItem('userActive', JSON.stringify(response?.data?.user));
            setLoading(false);
            // Redirect to dashboard or protected route after login
            navigate('/dashboard');
        } catch (err) {
            console.log("err", err);
            setError(err.response.data.message);
            setLoading(false); // Stop loading spinner
        }
    };

    // Handle forgot password email submission
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setEmailError('Email is required');
            return;
        }
        setLoadingFP(true); // Show loading spinner for forgot password
        setEmailError(''); // Reset email error state
        try {
            // Send email to reset-password API
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
                email
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Password reset link sent to email!',
                    confirmButtonText: 'OK',
                });                
                setShowModal(false); // Close the modal
                // navigate('/confirm-password'); // Redirect to confirm password page
            } else {
                setEmailError('Failed to send reset password email');
            }
            setLoadingFP(false); // Stop loading spinner
        } catch (err) {
            console.error('Forgot password error:', err);
            setEmailError('User with this email does not exist');
            setLoadingFP(false); // Stop loading spinner
        }
    };

    // Open the modal for forgot password
    const handleForgotPasswordClick = () => {
        setEmail('');
        setShowModal(true);
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="row w-100">
                <div className='offset-2 col-md-8 my-auto'>
                    <div className='card shadow-sm'>
                        <div className="card-body">
                            <h2 className="text-center">Login</h2>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <form onSubmit={handleLogin} className="mt-4">
                                <div className="form-group mb-2">
                                    <label htmlFor="username">Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        disabled={loading} // Disable input while loading
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password_hash}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading} // Disable input while loading
                                    />
                                </div>
                                <div className="mb-2">
                                    <a
                                        href="#forgotpassword"
                                        onClick={handleForgotPasswordClick}
                                        className="text-decoration-none"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>                                  
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    disabled={loading} // Disable button while loading
                                >
                                    {loading ? (
                                        <>
                                            Login
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>                                        
                                        </>
                                    ) : (
                                        'Login'
                                    )}
                                </button>
                            </form>                      
                        </div>
                    </div>                      
                </div>
            </div>
            
             {/* Forgot Password Modal */}
             <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleForgotPasswordSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Enter your email address:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {emailError && (
                                <p className="text-danger">{emailError}</p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="btn btn-block"
                            disabled={loadingFP} // Disable button while loading
                        >
                            {loadingFP ? (
                                <>
                                    Sending Reset Link
                                    <span
                                        className="spinner-border spinner-border-sm ms-2" // Add margin to the spinner for spacing
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>


        </div> // Close wrapper
    );
};

export default Login;
