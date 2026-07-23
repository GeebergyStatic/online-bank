import React, { useState } from 'react';
import { useUserContext } from 'userContextProvider/UserRoleContext';
import { Spinner } from "@chakra-ui/react";
import { toast } from 'react-toastify';
import ConfirmPinModal from 'components/confirmPIn/confirmPin';
import {
    Box,
    Button,
    Flex,
    Grid,
    Link,
    Text,
    useColorModeValue,
    SimpleGrid,
} from "@chakra-ui/react";

import './LoansPage.css'; // make sure this file exists

export default function LoansAndMortgages() {
    const { userData } = useUserContext();
    const userId = userData?.userId;
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        amount: '',
        purpose: '',
    });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {

        const { amount, purpose } = form;
        const userId = userData?.userId;

        if (!userId || !amount || !purpose) {
            const TOAST_ID = "loan-form-error-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.warning("All fields are required.", { className: "custom-toast" });
            }
            return;
        }

        const payload = {
            userId,
            transactionType: "Loan Request",
            amount,
            purpose,
        };

        setIsLoading(true); // Start loading

        try {
            const response = await fetch("https://online-bank-qulz.onrender.com/api/loan-application", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Loan request failed.");
            }

            const TOAST_ID = "loan-request-success-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.success("Loan request submitted successfully!", {
                    className: "custom-toast",
                });
            }

            // Reset form
            setForm({ amount: '', purpose: '' });

        } catch (error) {
            console.error("Loan request error:", error);
            const TOAST_ID = "loan-request-error-toast";
            if (!toast.isActive(TOAST_ID)) {
                toast.error(error.message || "Something went wrong.", {
                    className: "custom-toast",
                });
            }
        } finally {
            setIsLoading(false); // Stop loading
        }
    };


    return (
        <>
            <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
                <div className="loans-page">
                    <div className="loans-container">
                        <h1 style={{ textAlign: 'center' }}>Loan / Mortgage Application</h1>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault(); // Prevent page refresh
                                setIsOpen(true);    // Open modal
                            }}
                            className="loan-form"
                        >
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Enter loan amount"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Purpose / Narration</label>
                                <textarea
                                    name="purpose"
                                    value={form.purpose}
                                    onChange={handleChange}
                                    placeholder="Explain the purpose of the loan"
                                    rows={4}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ?
                                    <div style={{ padding: "10px", textAlign: "center" }}>
                                        <Spinner animation="border" size="sm" />
                                    </div> :
                                    "Submit Request"
                                }
                            </button>

                        </form>
                    </div>
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
