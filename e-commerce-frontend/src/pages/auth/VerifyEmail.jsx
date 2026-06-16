import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/features/authSlice';

export default function VerifyEmail() {
    const location = useLocation();
    console.log(location, "loca");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const email = location.state?.email;
    console.log('Email from location state:', email);
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Clear error when user starts typing
        if (error) setError('');

        // Auto focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handleBackspace = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate OTP is complete
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        if (!email) {
            setError('Email not found. Please signup again.');
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:4000/api/v1/verify-email",
                {
                    email: email,
                    otp: otpCode
                }
            )
console.log("VERIFY RESPONSE:", response.data);
            dispatch(loginSuccess({
                user: response.data.user,
                token: response.data.token
            }))
            setSuccess('Email verified successfully! Redirecting to login...');

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/user/dashboard');
            }, 2000);
        } catch (err) {
            console.log("Backend Error:", err.response?.data);
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setLoading(true);
            setError('');
            setSuccess('');

            if (!email) {
                setError('Email not found. Please signup again.');
                return;
            }
            await axios.post(
                "http://localhost:4000/api/v1/forgot-password",
                { email }
            );

            setSuccess('New verification code sent to your email!');
            setOtp(['', '', '', '', '', '']);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess('')
                navigate('/login');
                //   , { state: { email: formData.email } }
            }, 3000);
        } catch (err) {
            console.log("FULL ERROR:", err.response?.data);
            setError(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                {/* Left Side - Branding */}
                <div className="auth-branding">
                    <div className="branding-content">
                        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Verify Your Email</h1>
                        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
                            One more step to complete your registration
                        </p>
                        <div className="trust-badges">
                            <div className="badge-item">
                                <span style={{ fontSize: '2rem' }}>📧</span>
                                <span>Email Verified</span>
                            </div>
                            <div className="badge-item">
                                <span style={{ fontSize: '2rem' }}>⏱️</span>
                                <span>10 Minutes OTP</span>
                            </div>
                            <div className="badge-item">
                                <span style={{ fontSize: '2rem' }}>🛡️</span>
                                <span>Account Secure</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-container">
                    <div className="auth-form">
                        {/* Header */}
                        <div className="auth-header">
                            <h2 style={{ marginBottom: '0.5rem' }}>Enter Verification Code</h2>
                            <p style={{ color: '#999', marginBottom: '2rem' }}>
                                We've sent a 6-digit code to your email
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setError('')}
                                ></button>
                            </div>
                        )}

                        {/* Success Alert */}
                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleVerify}>
                            {/* OTP Inputs */}
                            <div className="otp-container mb-4">
                                <label className="form-label fw-600" style={{ marginBottom: '1.5rem', display: 'block' }}>
                                    Verification Code
                                </label>
                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleBackspace(index, e)}
                                            disabled={loading}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                fontSize: '1.5rem',
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                border: digit ? '2px solid #667eea' : '2px solid #e0e0e0',
                                                borderRadius: '8px',
                                                transition: 'all 0.3s ease',
                                                cursor: loading ? 'not-allowed' : 'text',
                                                opacity: loading ? 0.6 : 1
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Verify Button */}
                            <button
                                type="submit"
                                className="btn btn-login w-100 py-3 fw-600 mb-3"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Email'
                                )}
                            </button>

                            {/* Resend Code */}
                            <div className="text-center mb-3">
                                <p style={{ color: '#666', marginBottom: '0.5rem' }}>Didn't receive the code?</p>
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={loading}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: loading ? '#ccc' : '#667eea',
                                        textDecoration: 'underline',
                                        fontWeight: '600',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Resend Code
                                </button>
                            </div>

                            {/* Back to Login */}
                            <div className="text-center">
                                <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}


