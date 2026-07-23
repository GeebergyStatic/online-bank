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
import { Box, Grid, Button, Text, Flex, Icon, Link } from "@chakra-ui/react";
import { MdWarningAmber } from 'react-icons/md'; // caution/warning icon
import React, { useState } from 'react';
import { useUserContext } from "userContextProvider/UserRoleContext";
import ReactCardFlip from 'react-card-flip';
import { toast } from "react-toastify";
import { FaRegCopy, FaCheckCircle } from 'react-icons/fa';
import './VirtualCardFlip.css'; // We'll use CSS for styling glow/neon#
import visaLogo from 'assets/img/icons/Visa_Logo_2014.png';
import Loading from "loadingScreen/Loading";
import ConfirmPinModal from "components/confirmPIn/confirmPin";



export default function VirtualCard() {
    const { userData, setUserData } = useUserContext();
    const userId = userData?.userId;
    const [isOpen, setIsOpen] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [copiedField, setCopiedField] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFlip = () => setIsFlipped(prev => !prev);

    const copyToClipboard = (value, field) => {
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        toast.info(`Text Copied!`, { className: "custom-toast" });
        setTimeout(() => setCopiedField(null), 2000);
    };

    const clientName = userData?.virtualCard?.cardName || "";
    const cvv = userData?.virtualCard?.cvv || "";
    const cardNumber = userData?.virtualCard?.cardNumber || "";
    const expiry = userData?.virtualCard?.expiryDate || "";


    const handleGenerateVirtualCard = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://online-bank-qulz.onrender.com/api/generate-card/${userData.userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to generate card");

            const updatedUser = await response.json();

            // Artificial delay (e.g. 1.5 seconds)
            await new Promise(resolve => setTimeout(resolve, 2500));

            setUserData(updatedUser);
            toast.success("Virtual Card created successfully!", { className: "custom-toast" });
        } catch (error) {
            console.error("Error generating virtual card:", error);
            toast.error("Failed to create virtual card.", { className: "custom-toast" });
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <>
            <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
                {userData?.virtualCard && userData.virtualCard.cardNumber ? (
                    // Show the virtual card if it exists
                    <>
                        <Flex align="center" mb="40px">
                            <Icon
                                as={userData.virtualCard.status === 'active' ? FaCheckCircle : MdWarningAmber}
                                color={userData.virtualCard.status === 'active' ? 'green.500' : 'yellow.500'}
                                boxSize={5}
                                mr={3}
                            />
                            <Text
                                color={userData.virtualCard.status === 'active' ? 'green.600' : 'yellow.700'}
                                fontSize="md"
                                fontWeight="medium"
                            >
                                {userData.virtualCard.status === 'active' ? (
                                    'Your card is active.'
                                ) : (
                                    <>
                                        Your card is inactive. Please contact your account manager via live chat or{' '}
                                        <Link
                                            href="mailto:trustline@chainaccess.org"
                                            color="blue.500"
                                            textDecoration="underline"
                                        >
                                            support
                                        </Link>
                                        .
                                    </>
                                )}
                            </Text>
                        </Flex>
                        <div className="card-and-info-wrapper">
                            <div className="card-container" onClick={handleFlip}>
                                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                                    <div className="card front" key="front">
                                        <svg viewBox="0 0 400 250" className="card-svg">
                                            <defs>
                                                <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#f2f2f2" />
                                                    <stop offset="100%" stopColor="#cccccc" />
                                                </linearGradient>
                                            </defs>
                                            <rect x="0" y="0" width="400" height="250" rx="20" fill="url(#bgGradient)" stroke="#bbb" strokeWidth="1.5" />

                                            {/* Sleek ATM-style chip */}
                                            <rect x="30" y="40" width="50" height="40" rx="5" fill="#d9d9d9" stroke="#999" strokeWidth="1" />
                                            <rect x="38" y="48" width="34" height="24" rx="3" fill="#b3b3b3" stroke="#888" strokeWidth="0.8" />
                                            <line x1="38" y1="60" x2="72" y2="60" stroke="#999" strokeWidth="0.5" />
                                            <line x1="55" y1="48" x2="55" y2="72" stroke="#999" strokeWidth="0.5" />

                                            <text x="30" y="120" fill="#222" fontSize="20" letterSpacing="3">{cardNumber}</text>
                                            <text x="30" y="160" fill="#444" fontSize="16">{clientName}</text>
                                            <text x="320" y="160" fill="#444" fontSize="16">{expiry}</text>
                                            {/* Visa logo right-aligned */}
                                            <image
                                                href={visaLogo}
                                                x={320}
                                                y={30}
                                                height={20}
                                                width={50}
                                                alt="Visa Logo"
                                            />


                                        </svg>
                                    </div>

                                    <div className="card back" key="back">
                                        <svg viewBox="0 0 400 250" className="card-svg">
                                            <defs>
                                                <linearGradient id="bgGradientBack" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#f2f2f2" />
                                                    <stop offset="100%" stopColor="#cccccc" />
                                                </linearGradient>
                                            </defs>
                                            <rect x="0" y="0" width="400" height="250" rx="20" fill="url(#bgGradientBack)" stroke="#bbb" strokeWidth="1.5" />
                                            <rect x="0" y="40" width="400" height="40" fill="#888" />
                                            <rect x="280" y="130" width="90" height="30" fill="#fff" rx="5" />
                                            <text x="290" y="150" fill="#000" fontSize="14" fontWeight="bold">{cvv}</text>
                                            <text x="30" y="30" fill="#555" fontSize="14">SECURITY CODE</text>
                                        </svg>
                                    </div>
                                </ReactCardFlip>
                            </div>

                            <div className="card-details">
                                <div className="field">
                                    <label>Cardholder Name</label>
                                    <div className="field-content">
                                        <input type="text" value={clientName} readOnly />
                                        <button onClick={() => copyToClipboard(clientName, 'name')}><FaRegCopy /></button>
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Card Number</label>
                                    <div className="field-content">
                                        <input type="text" value={cardNumber} readOnly />
                                        <button onClick={() => copyToClipboard(cardNumber, 'cardNumber')}><FaRegCopy /></button>
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Expiry Date</label>
                                    <div className="field-content">
                                        <input type="text" value={expiry} readOnly />
                                        <button onClick={() => copyToClipboard(expiry, 'expiry')}><FaRegCopy /></button>
                                    </div>
                                </div>
                                <div className="field">
                                    <label>CVV</label>
                                    <div className="field-content">
                                        <input type="text" value={cvv} readOnly />
                                        <button onClick={() => copyToClipboard(cvv, 'cvv')}><FaRegCopy /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // Show the Generate Virtual Card button if no card
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <Text fontSize="xl" mb={4}>You don't have a virtual card yet.</Text>
                        <Button
                            colorScheme="teal"
                            size="lg"
                            onClick={() => setIsOpen(true)}
                        >
                            Generate Virtual Card
                        </Button>
                    </div>
                )}
                {isLoading && <Loading />}
            </Box>
            <ConfirmPinModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={handleGenerateVirtualCard}
                userId={userId}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
            />
        </>
    );
}
