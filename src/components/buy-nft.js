import React, { useState } from 'react';
import { Container, Row, Col, Card, Accordion, Button, Table } from 'react-bootstrap';
import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';
import { useUserContext } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Buy = () => {
    const [tapCount, setTapCount] = useState(0);
    const [lastTapTime, setLastTapTime] = useState(0);

    const CustomLink = ({ to, children, ...props }) => {
        const resolvedPath = useResolvedPath(to);
        const isActive = useMatch({ path: resolvedPath.pathname, end: true });

        return (
            <li className={isActive ? 'active' : ''}>
                <Link to={to} {...props}>
                    {children}
                </Link>
            </li>
        );
    };

    const { userData, currentUser } = useUserContext();

    const handleCopy = () => {
        const tempInput = document.createElement('input');
        tempInput.value = `https://app.minterpro.online/login?ref=${userData.referralCode}`;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast.info('Referral link copied to clipboard!', { position: toast.POSITION.TOP_CENTER });
    };

    const handleCopyCode = () => {
        const tempInput = document.createElement('input');
        tempInput.value = userData.referralCode;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast.info('Referral Code copied to clipboard!', { position: toast.POSITION.TOP_CENTER });
    };

    const handleCopyAgentCode = () => {
        const tempInput = document.createElement('input');
        tempInput.value = userData.agentID;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast.info('Agent ID copied to clipboard!', { position: toast.POSITION.TOP_CENTER });
    };

    const generateAgentID = () => {
        return "AGENT-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const handleProfilePictureTap = async () => {
        const now = Date.now();
        if (now - lastTapTime < 2000) {
            setTapCount(prev => prev + 1);
        } else {
            setTapCount(1);
        }
        setLastTapTime(now);

        if (tapCount + 1 === 8) {
            if (userData?.role !== "agent") {
                try {
                    const agentID = generateAgentID();
                    const token = localStorage.getItem("token");
                    await fetch("https://broker-app-4xfu.onrender.com/api/update-user", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            // Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ role: "agent", agentID, userId: userData.userID })
                    });

                    toast.success("You are now an agent!", { position: toast.POSITION.TOP_CENTER });

                    // Refresh the page after 2 seconds
                      setTimeout(() => {
                        window.location.reload();
                    }, 2000);

                } catch (error) {
                    console.error("Error updating role", error);
                    toast.error("Could not update role. Try again later.", { position: toast.POSITION.TOP_CENTER });
                }
            } else {
                toast.info("You are already an agent.", { position: toast.POSITION.TOP_CENTER });
            }
            setTapCount(0);
        }
    };

    return (
        <div className='container-large'>
            <ToastContainer />
            <div className='main-container d-flex justify-content-center'>
                <p style={{fontSize: 'medium'}} className='text-secondary fw-bold'>Link your wallet to see NFTs.</p>
            </div>
            
        </div>
    );
};

export default Buy;
