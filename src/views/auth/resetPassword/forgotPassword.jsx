import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('');
        try {
            await axios.post('https://online-bank-qulz.onrender.com/api/request-reset', { email });
            setStatus('✅ Check your email for the reset link. This may take a few minutes to arrive.');
        } catch (err) {
            setStatus('❌ ' + (err.response?.data?.message || 'Something went wrong.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Forgot Password</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        background: isLoading ? '#a5b4fc' : '#2563eb',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span style={styles.spinner}></span>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
                {status && <p style={styles.status}>{status}</p>}
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    title: {
        textAlign: 'center',
        marginBottom: '1rem',
        color: '#1e3a8a'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        borderRadius: '6px',
        border: '1px solid #ccc'
    },
    button: {
        padding: '12px',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
    },
    status: {
        marginTop: '1rem',
        color: '#333',
        fontWeight: '500',
        textAlign: 'center'
    },
    spinner: {
        width: '18px',
        height: '18px',
        border: '3px solid #fff',
        borderTop: '3px solid transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block'
    }
};

// Add CSS animation for the spinner
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);

export default ForgotPassword;
