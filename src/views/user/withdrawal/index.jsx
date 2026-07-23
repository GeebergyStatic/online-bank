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
import { Box, Grid, Spinner } from "@chakra-ui/react";
import React, { useState, useRef, useEffect } from 'react';
import { useUserContext } from "userContextProvider/UserRoleContext";
import { toast } from "react-toastify";
import { FaBitcoin, FaPaypal, FaUniversity } from 'react-icons/fa';
import ConfirmPinModal from "components/confirmPIn/confirmPin";

export default function Withdrawal() {
    const { userData } = useUserContext();
    const userId = userData?.userId;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);
    const [formData, setFormData] = useState({
        cryptoAmount: '',
        cryptoCurrency: 'BTC',
        cryptoWallet: '',
        paypalEmail: '',
        paypalAmount: '',
        bankName: '',
        bankAccountNumber: '',
        bankEmail: '',
        bankAccountName: '',
        swiftCode: '',
        bankAddress: '',
        bankAmount: '',
        additionalInfo: '',
    });

    useEffect(() => {
        if (selectedMethod && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedMethod]);


    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {

        if (!selectedMethod) {
            const TOAST_ID = "method-error-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.warning("Please select a withdrawal method..", {
                    className: "custom-toast",
                });
            }
            return;
        }

        const userId = userData?.userId;
        const userBalance = parseFloat(userData?.balance) || 0;

        if (!userId) {
            const TOAST_ID = "missing-id-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.warning("User ID is missing", {
                    className: "custom-toast",
                });
            }
            return;
        }

        let payload = { userId, method: selectedMethod };
        let amountToWithdraw = 0;

        if (selectedMethod === "crypto") {
            const { cryptoAmount, cryptoCurrency, cryptoWallet } = formData;
            if (!cryptoAmount || !cryptoWallet) {
                const TOAST_ID = "missing-crypto-fields-toast";
                if (!toast.isActive(TOAST_ID)) {
                    toast.warning("Please fill in all crypto withdrawal fields.", {
                        className: "custom-toast",
                    });
                }
                return;
            }
            amountToWithdraw = parseFloat(cryptoAmount);
            payload = { ...payload, cryptoAmount, cryptoCurrency, cryptoWallet };
        } else if (selectedMethod === "paypal") {
            const { paypalEmail, paypalAmount } = formData;
            if (!paypalEmail || !paypalAmount) {
                const TOAST_ID = "missing-paypal-fields-toast";
                if (!toast.isActive(TOAST_ID)) {
                    toast.warning("Please fill in all PayPal withdrawal fields.", {
                        className: "custom-toast",
                    });
                }
                return;
            }
            amountToWithdraw = parseFloat(paypalAmount);
            payload = { ...payload, paypalEmail, paypalAmount };
        } else if (selectedMethod === "bank") {
            const {
                bankAccountName, bankAccountNumber, bankEmail, bankName, swiftCode,
                bankAddress, bankAmount, additionalInfo,
            } = formData;
            if (!bankAccountName || !bankAccountNumber || !bankEmail || !bankName || !swiftCode || !bankAddress || !bankAmount) {
                const TOAST_ID = "missing-bank-fields-toast";
                if (!toast.isActive(TOAST_ID)) {
                    toast.warning("Please fill in all bank withdrawal fields.", {
                        className: "custom-toast",
                    });
                }
                return;
            }
            amountToWithdraw = parseFloat(bankAmount);
            payload = {
                ...payload,
                bankAccountName, bankAccountNumber, bankEmail, bankName, swiftCode,
                bankAddress, bankAmount, additionalInfo
            };
        }

        if (amountToWithdraw > userBalance) {
            const TOAST_ID = "insufficient-balance-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.error("Insufficient balance for this withdrawal.", {
                    className: "custom-toast",
                });
            }
            return;
        }

        setIsLoading(true); // Start loading

        try {
            const response = await fetch("https://online-bank-qulz.onrender.com/api/withdraw", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Withdrawal failed.");
            }

            const TOAST_ID = "withdrawal-success-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.success("Withdrawal submitted successfully!", {
                    className: "custom-toast",
                });
            }

            // Reload the page after a short delay
            setTimeout(() => window.location.reload(), 1000);
            // Optionally update balance:
            // setUserData({ ...userData, balance: userBalance - amountToWithdraw });

        } catch (error) {
            console.error("Withdrawal error:", error);
            const TOAST_ID = "withdrawal-error-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.error(`${error.message || "Something went wrong."}`, {
                    className: "custom-toast",
                });
            }
        } finally {
            setIsLoading(false); // Stop loading
        }
    };



    return (
        <>
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                <div className="withdrawal-container">
                    <h2>Withdraw Funds</h2>

                    <div className="method-options">
                        <div
                            className={`method-box ${selectedMethod === 'crypto' ? 'active' : ''}`}
                            onClick={() => setSelectedMethod('crypto')}
                        >
                            <FaBitcoin color="#000" size={40} />
                            <strong>Crypto</strong>
                            <span className="subtext">Withdraw via Bitcoin, Ethereum or USDT</span>
                        </div>

                        <div
                            className={`method-box ${selectedMethod === 'paypal' ? 'active' : ''}`}
                            onClick={() => setSelectedMethod('paypal')}
                        >
                            <FaPaypal size={40} />
                            <strong>PayPal</strong>
                            <span className="subtext">Withdraw via PayPal</span>
                        </div>

                        <div
                            className={`method-box ${selectedMethod === 'bank' ? 'active' : ''}`}
                            onClick={() => setSelectedMethod('bank')}
                        >
                            <FaUniversity size={40} />
                            <strong>Bank Transfer</strong>
                            <span className="subtext">Withdraw to your bank account</span>
                        </div>
                    </div>

                    <div ref={formRef}>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); // Prevent page refresh
                                setIsOpen(true);    // Open modal
                            }}
                        >
                            {/* CRYPTO FORM */}
                            {selectedMethod === 'crypto' && (
                                <>
                                    <div className="form-group">
                                        <label>Amount</label>
                                        <input
                                            type="number"
                                            placeholder="Enter withdrawal amount"
                                            name="cryptoAmount"
                                            value={formData.cryptoAmount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Cryptocurrency</label>
                                        <select
                                            name="cryptoCurrency"
                                            value={formData.cryptoCurrency}
                                            onChange={handleChange}
                                        >
                                            <option value="BTC">Bitcoin (BTC)</option>
                                            <option value="ETH">Ethereum (ETH)</option>
                                            <option value="USDT">USDT (TRC-20)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Wallet Address</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your wallet address"
                                            name="cryptoWallet"
                                            value={formData.cryptoWallet}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {/* PAYPAL FORM */}
                            {selectedMethod === 'paypal' && (
                                <>
                                    <div className="form-group">
                                        <label>PayPal Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your paypal email"
                                            name="paypalEmail"
                                            value={formData.paypalEmail}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Amount</label>
                                        <input
                                            type="number"
                                            placeholder="Enter withdrawal amount"
                                            name="paypalAmount"
                                            value={formData.paypalAmount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {/* BANK FORM */}
                            {selectedMethod === 'bank' && (
                                <>
                                    <div className="form-group">
                                        <label>Account Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your account name"
                                            name="bankAccountName"
                                            value={formData.bankAccountName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Account Number</label>
                                        <input
                                            type="number"
                                            placeholder="Enter your account number"
                                            name="bankAccountNumber"
                                            value={formData.bankAccountNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            name="bankEmail"
                                            value={formData.bankEmail}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Bank Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your bank name"
                                            name="bankName"
                                            value={formData.bankName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>SWIFT Code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter SWIFT code"
                                            name="swiftCode"
                                            value={formData.swiftCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Bank Address</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your bank address"
                                            name="bankAddress"
                                            value={formData.bankAddress}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Withdrawal Amount</label>
                                        <input
                                            type="number"
                                            placeholder="Enter withdrawal amount"
                                            name="bankAmount"
                                            value={formData.bankAmount}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Additional Info (Optional)</label>
                                        <textarea
                                            name="additionalInfo"
                                            placeholder="Enter any additional info..."
                                            value={formData.additionalInfo}
                                            onChange={handleChange}
                                            rows={3}
                                        />
                                    </div>
                                </>
                            )}

                            {selectedMethod && (
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div style={{ padding: "10px", textAlign: "center" }}>
                                            <Spinner animation="border" size="sm" />
                                        </div>
                                    ) : (
                                        "Submit Withdrawal"
                                    )}
                                </button>

                            )}
                        </form>
                    </div>

                    <style>{`
        .withdrawal-container {
          max-width: 600px;
          margin: 40px auto;
          padding: 0 20px;
        }
        h2 {
          text-align: center;
          margin-bottom: 30px;
          font-weight: bold;
        }
        .method-options {
          display: flex;
          gap: 15px;
          flex-direction: column;
        }
        @media(min-width: 600px) {
          .method-options {
            flex-direction: row;
          }
        }
        .method-box {
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  background: #f5f5f5;
  color: #000;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

        .method-box.active {
          background: #e0f7fa;
          box-shadow: 0 4px 16px rgba(0, 150, 136, 0.3);
        }
        .method-box strong {
          display: block;
          margin-top: 10px;
          font-size: 1.1rem;
        }
        .subtext {
          font-size: 0.85rem;
          color: #555;
          margin-top: 4px;
        }
        .withdrawal-form {
          margin-top: 30px;
        }
        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 600;
          margin-bottom: 6px;
        }
        input, select, textarea {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          background: #fff;
          color: #000;
        }
        textarea {
          resize: vertical;
        }
        .submit-btn {
          background-color: #009688;
          color: white;
          border: none;
          padding: 12px 20px;
          font-weight: bold;
          font-size: 1rem;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
        }
        .submit-btn:hover {
          background-color: #00796b;
        }
      `}</style>
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
