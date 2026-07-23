/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import React, { useEffect, useState } from 'react';
import { useUserContext } from 'userContextProvider/UserRoleContext';

// import { useUserContext } from './UserRoleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import { FaBitcoin, FaPaypal, FaUniversity } from "react-icons/fa";
import { Box, Grid } from "@chakra-ui/react";
import { Form, Button, Alert } from "react-bootstrap";
import { Spinner } from "@chakra-ui/react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "contexts/firebase";
import ConfirmPinModal from 'components/confirmPIn/confirmPin';
import './deposit.css';


export default function Deposit() {
    const { userData } = useUserContext();
    const [isOpen, setIsOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    // wallet logic code
    // const agentCode = userData.agentCode;
    // const userId = userData.userID;
    const userId = userData?.userId;
    const agentCode = userData?.agentCode;
    const [walletAddresses, setWalletAddresses] = useState([]);
    const [loadingWallets, setLoadingWallets] = useState(true); // NEW
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // 
    const [formData, setFormData] = useState({
        file: null,
        amount: "",
    });

    const copyToClipboard = () => {
        navigator.clipboard.writeText(selectedWallet.address);
        const TOAST_ID = "copied-toast";

        if (!toast.isActive(TOAST_ID)) {
            toast.info("Address copied to clipboard!", {
                position: "top-right",
                className: "custom-toast",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    };

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, file }));

        if (file) {
            setUploading(true);
            const storageRef = ref(storage, `nft-deposit-files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Optional: Track upload progress
                },
                (error) => {
                    console.error("Upload error:", error);
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setFileUrl(downloadURL);
                    setUploading(false);
                }
            );
        }
    };

    useEffect(() => {
        setLoadingWallets(true);
        fetch("https://online-bank-qulz.onrender.com/api/fetchWallets")
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setWalletAddresses(data);
                } else {
                    setWalletAddresses([]);
                }
            })
            .catch(err => {
                console.error('Failed to fetch wallet addresses:', err);
                setWalletAddresses([]);
            })
            .finally(() => {
                setLoadingWallets(false); // FINISH LOADING
            });
    }, []);





    const handleSubmit = async (e) => {

        if (!fileUrl) {
            alert("Please wait for file to finish uploading.");
            return;
        }
        setIsLoading(true);

        const submissionData = {
            userId,
            ...formData,
            fileUrl, // Store uploaded file URL
            agentID: agentCode,
            status: "pending", // Default status when submitting
        };

        try {
            const response = await fetch("https://online-bank-qulz.onrender.com/api/deposit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();

            if (response.ok) {
                const TOAST_ID = "success-deposit-toast";

                if (!toast.isActive(TOAST_ID)) {
                    toast.success("ETH deposit submitted successfully!", {
                        className: "custom-toast",
                    });
                }
                console.log("ETH deposit Submission Response:", data);
                setIsLoading(false);
            } else {
                const TOAST_ID = "failed-deposit-toast";

                if (!toast.isActive(TOAST_ID)) {
                    toast.error(data.message || "Failed to submit ETH deposit.", {
                        className: "custom-toast",
                    });
                }
                console.error("Error:", data);
                setIsLoading(false);
            }
        } catch (error) {
            const TOAST_ID = "deposit-error-toast";

            if (!toast.isActive(TOAST_ID)) {
                toast.error("An error occurred while submitting ETH deposit.", {
                    className: "custom-toast",
                });
            }
            console.error("Submission Error:", error);
            setIsLoading(false);
        }
    };

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const labelStyle = {
        display: 'block',
        fontWeight: 600,
        marginBottom: '0.5rem',
        color: '#1e293b',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        fontSize: '1rem',
        background: '#f1f5f9',
        color: '#0f172a',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        outline: 'none',
        transition: 'border-color 0.2s ease',
    };




    // Custom components
    const options = [
        {
            id: "crypto",
            icon: <FaBitcoin size={24} color="#f7931a" />, // Bitcoin orange
            label: "Crypto",
            note: "Fastest payment method",
            hasDropdown: true,
            dropdownContent: (
                <div
                    style={{
                        maxWidth: '600px',
                        margin: '2rem auto',
                        padding: '2.5rem',
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                        fontFamily: `'Inter', sans-serif`,
                    }}
                >
                    <h2
                        style={{
                            fontWeight: 700,
                            fontSize: '1.8rem',
                            textAlign: 'center',
                            marginBottom: '1rem',
                            color: '#0f172a',
                        }}
                    >
                        Deposit & Submit Proof
                    </h2>
                    <p
                        style={{
                            textAlign: 'center',
                            color: '#64748b',
                            marginBottom: '2rem',
                            fontSize: '0.95rem',
                        }}
                    >
                        Securely fund your account and upload your payment confirmation.
                    </p>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault(); // Prevent page refresh
                            setIsOpen(true);    // Open modal
                        }}
                    >
                        {/* Wallet Select */}
                        <div style={{ marginBottom: '1.8rem' }}>
                            <label style={labelStyle}>Choose Wallet</label>
                            {loadingWallets ? (
                                <div style={{ padding: "10px", textAlign: "center" }}>
                                    <Spinner animation="border" size="sm" />
                                </div>
                            ) : (
                                <select
                                    name="cryptoWallet"
                                    value={selectedWallet?._id || ''}
                                    onChange={(e) => {
                                        const wallet = walletAddresses.find((w) => w._id === e.target.value);
                                        setSelectedWallet(wallet);
                                    }}
                                    style={inputStyle}
                                >
                                    <option value="">Select a wallet</option>
                                    {walletAddresses.map((wallet) => (
                                        <option key={wallet._id} value={wallet._id}>
                                            {wallet.type}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>


                        {/* Wallet Info Display */}
                        {selectedWallet && (
                            <div
                                style={{
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    padding: '1.2rem',
                                    marginBottom: '1.8rem',
                                    textAlign: 'center',
                                }}
                            >
                                <img
                                    src={selectedWallet.url}
                                    alt="QR Code"
                                    style={{
                                        maxWidth: '160px',
                                        marginBottom: '1rem',
                                        borderRadius: '8px',
                                        display: 'block',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                    }}
                                />

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#1d4ed8',
                                        textAlign: 'center',
                                    }}
                                >
                                    <span style={{ fontWeight: 'bold', width: '100%' }}>
                                        {selectedWallet.address.slice(0, 6)}...{selectedWallet.address.slice(-4)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={copyToClipboard}
                                        style={{
                                            background: 'transparent',
                                            border: '2px solid #1d4ed8',
                                            borderRadius: '18px',
                                            padding: '0.4rem 0.75rem',
                                            // color: '#0f172a',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            marginTop: '0.3rem',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faCopy} />
                                        Copy
                                    </button>
                                </div>
                            </div>

                        )}


                        {/* Amount */}
                        <div style={{ marginBottom: '1.8rem' }}>
                            <label style={labelStyle}>Amount (USD)</label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="e.g. 50"
                                required
                                style={inputStyle}
                            />
                        </div>

                        {/* File Upload */}
                        <div style={{ marginBottom: '1.8rem' }}>
                            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                Upload Proof
                                <span title="Only screenshot formats (JPG, PNG) are accepted">
                                    <FontAwesomeIcon icon={faCircleInfo} style={{ color: '#2563eb', cursor: 'help' }} />
                                </span>
                            </label>
                            <p style={{ marginTop: '0.2rem', marginBottom: '0.8rem', fontSize: '0.85rem', color: '#64748b' }}>
                                Please upload a screenshot of your transaction (JPG or PNG).
                            </p>

                            <input
                                type="file"
                                onChange={handleFileUpload}
                                required
                                style={{ ...inputStyle, padding: '10px 12px' }}
                            />
                            {uploading && (
                                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#475569' }}>
                                    <Spinner animation="border" size="sm" /> Uploading...
                                </div>
                            )}
                            {fileUrl && (
                                <div style={{ marginTop: '0.5rem', color: 'green', fontSize: '0.9rem' }}>
                                    ✅ File uploaded successfully!
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '10px',
                                fontWeight: 700,
                                fontSize: '1rem',
                                background: 'linear-gradient(to right, #1d4ed8, #2563eb)',
                                color: '#fff',
                                border: 'none',
                                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.3s ease',
                                opacity: isLoading ? 0.6 : 1,
                            }}
                        >
                            {isLoading ? <Spinner animation="border" size="sm" className="text-white" /> : 'Submit Proof'}
                        </button>
                    </form>
                </div>

            ),
        },
        {
            id: "paypal",
            icon: <FaPaypal size={24} color="#003087" />, // Paypal blue
            label: "Paypal",
            hasDropdown: true,
            dropdownContent: (
                <p>Contact your account manager through the live chat to complete payment using this method.</p>
            ),
        },
        {
            id: "bank",
            icon: <FaUniversity size={24} color="#4A90E2" />, // Bank blue
            label: "Bank",
            hasDropdown: true,
            dropdownContent: (
                <p>Contact your account manager through the live chat to complete payment using this method.</p>
            ),
        },
    ];



    return (
        <>
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                <div style={{ maxWidth: 400, margin: "0 auto" }}>
                    {options.map(({ id, icon, label, note, hasDropdown, dropdownContent }) => (
                        <div
                            key={id}
                            style={{
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                borderRadius: 8,
                                marginBottom: 16,
                                padding: 12,
                                cursor: hasDropdown ? "pointer" : "default",
                                userSelect: "none",
                            }}
                            onClick={() => hasDropdown && toggleDropdown(id)}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div style={{ marginRight: 12, width: 32, textAlign: "center" }}>
                                    {icon}
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <div style={{ fontWeight: "bold" }}>{label}</div>
                                    {note && (
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#666",
                                                marginTop: 4,
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {note}
                                        </div>
                                    )}
                                </div>
                                {hasDropdown && (
                                    <div
                                        style={{
                                            fontSize: 16,
                                            transform: openDropdown === id ? "rotate(180deg)" : "rotate(0deg)",
                                            transition: "transform 0.3s",
                                        }}
                                    >
                                        ▼
                                    </div>
                                )}
                            </div>

                            {openDropdown === id && (
                                <div
                                    style={{
                                        marginTop: 12,
                                        padding: 8,
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: 6,
                                        fontSize: 14,
                                        color: "#333",
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {dropdownContent}
                                </div>
                            )}
                        </div>
                    ))}
                </div>


            </Box>
            <ConfirmPinModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={handleSubmit}
                userId={userId}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </>

    );
}
