import React, { useState } from 'react';
import axios from 'axios';
import { Spinner } from "@chakra-ui/react";
import { toast } from "react-toastify";

const CreateTransactionModal = ({ user, onClose, onTransactionCreated }) => {
    const generateTransactionReference = () => {
        return `TXN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    };
    const transactionReference = generateTransactionReference();

    const [formData, setFormData] = useState({
        transactionReference,
        userId: user.userId, // use custom user ID
        amount: '',
        transactionType: '',
        senderOrReceiver: '',
        description: '',
        status: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            await axios.post(`https://online-bank-qulz.onrender.com/api/send-transactions`, formData);
            onTransactionCreated(); // callback to refresh transactions
            onClose(); // close modal

            const TOAST_ID = "success-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.success("Transaction sent successfully!", {
                    toastId: TOAST_ID,
                    className: "custom-toast",
                });
            }
        } catch (err) {
            console.error('Error creating transaction:', err);
            const message = err.response?.data?.message || "Transaction failed to send!";

            const TOAST_ID = "failed-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.error(message, {
                    toastId: TOAST_ID,
                    className: "custom-toast",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2>Create Transaction</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                    <div style={inputContainerStyle}>
                        <label style={labelStyle}>Amount:</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={inputContainerStyle}>
                        <label style={labelStyle}>Transaction Type:</label>
                        <select
                            name="transactionType"
                            value={formData.transactionType}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Deposit">Deposit</option>
                            <option value="Withdrawal">Withdrawal</option>
                            {/* <option value="Transfer">Transfer</option> */}
                        </select>
                    </div>

                    <div style={inputContainerStyle}>
                        <label style={labelStyle}>Sender/Receiver (Name):</label>
                        <input
                            type="text"
                            name="senderOrReceiver"
                            value={formData.senderOrReceiver}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={inputContainerStyle}>
                        <label style={labelStyle}>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    <div style={inputContainerStyle}>
                        <label style={labelStyle}>Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>

                    {isLoading ? (
                        <Spinner animation="border" size="sm" variant='primary' />
                    ) : (
                        <div style={buttonContainerStyle}>
                            <button type="submit" style={saveButtonStyle}>Create</button>
                            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

// Modal overlay style (dimmed background)
const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's on top of other content
};

// Modal content box style
const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px', // Increased width for better form layout
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxHeight: '80vh', // Limit the height of the modal
    overflowY: 'auto', // Enable scroll if content exceeds height
};

// Input container for consistent spacing
const inputContainerStyle = {
    marginBottom: '15px', // Space between form fields
    textAlign: 'left',
};

// Label style
const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
    color: '#000',
};

// Input field style
const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
};

// Button container style
const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
};

// Save button style
const saveButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '48%',
};

const cancelButtonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '48%',
};


export default CreateTransactionModal;