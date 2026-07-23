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

import React, { useEffect, useState } from 'react';
import { useUserContext } from 'userContextProvider/UserRoleContext';

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Link,
  Text,
  useColorModeValue,
  SimpleGrid,
  Spinner
} from "@chakra-ui/react";

// Custom components
import Banner from "views/user/marketplace/components/Banner";
import TableTopCreators from "views/user/marketplace/components/TableTopCreators";
import HistoryItem from "views/user/marketplace/components/HistoryItem";
import NFT from "components/card/NFT";
import Card from "components/card/Card.js";
import TradingViewWidget from "./components/ChartWidget";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCopy, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import { storage } from "contexts/firebase";
import ConfirmPinModal from 'components/confirmPIn/confirmPin';

// Assets
import Nft1 from "assets/img/nfts/Nft1.png";
import Nft2 from "assets/img/nfts/Nft2.png";
import Nft3 from "assets/img/nfts/Nft3.png";
import Nft4 from "assets/img/nfts/Nft4.png";
import Nft5 from "assets/img/nfts/Nft5.png";
import Nft6 from "assets/img/nfts/Nft6.png";
import Avatar1 from "assets/img/avatars/avatar1.png";
import Avatar2 from "assets/img/avatars/avatar2.png";
import Avatar3 from "assets/img/avatars/avatar3.png";
import Avatar4 from "assets/img/avatars/avatar4.png";
import tableDataTopCreators from "views/user/marketplace/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/user/marketplace/variables/tableColumnsTopCreators";

export default function CryptoInvestments() {
  const { userData } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isEthOpen, setIsEthOpen] = useState(false);
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");

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
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [ethPrice, setEthPrice] = useState(0);
  const [ethBalance, setEthBalance] = useState('0.00');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [convertedUSD, setConvertedUSD] = useState('0.00');
  const [activeTab, setActiveTab] = useState('fund'); // 'fund' or 'withdraw'

  // Fetch ETH price
  useEffect(() => {
    async function fetchEthPrice() {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await res.json();
      setEthPrice(data.ethereum.usd);
    }
    fetchEthPrice();
  }, []);

  // Simulate balance (replace with actual wallet connection / backend logic)
  useEffect(() => {
    const getBalance = async () => {
      // Replace this with actual logic (like from MetaMask or backend)
      setEthBalance(userData?.ethBalance);
    };
    getBalance();
  }, []);

  // Calculate USD equivalent
  useEffect(() => {
    const usd = (parseFloat(withdrawAmount || 0) * ethPrice).toFixed(2);
    setConvertedUSD(usd);
  }, [withdrawAmount, ethPrice]);

  const handleWithdraw = async (e) => {
    setIsWithdrawing(true); // Start loading

    if (parseFloat(withdrawAmount) > parseFloat(ethBalance)) {
      setIsWithdrawing(false);
      const TOAST_ID = "insufficient-funds-toast";

      if (!toast.isActive(TOAST_ID)) {
        toast.error("You don't have enough balance.", {
          className: "custom-toast",
        });
      }
      return;
    }

    const userId = userData?.userId;
    if (!userId) {
      setIsWithdrawing(false);
      const TOAST_ID = "missing-user-toast";

      if (!toast.isActive(TOAST_ID)) {
        toast.error("User ID is missing.", {
          className: "custom-toast",
        });
      }
      return;
    }

    try {
      const response = await fetch("https://online-bank-qulz.onrender.com/api/eth-withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ethAmount: parseFloat(withdrawAmount),
          usdAmount: parseFloat(convertedUSD),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Withdrawal failed.");
      }

      const TOAST_ID = "withdraw-success-toast";

      if (!toast.isActive(TOAST_ID)) {
        toast.success("ETH withdrawal successful!", {
          className: "custom-toast",
        });
      }

      // Reload the page after a short delay
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      const TOAST_ID = "withdraw-error-toast";

      if (!toast.isActive(TOAST_ID)) {
        toast.error(`Withdrawal failed: ${error.message}`, {
          className: "custom-toast",
        });
      }
    }
    finally {
      setIsWithdrawing(false); // Stop loading
    }
  };



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
      const storageRef = ref(storage, `online-bank-deposit-files/${file.name}`);
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
    fetch("https://online-bank-qulz.onrender.com/api/fetchEthWallets")
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
      const response = await fetch("https://online-bank-qulz.onrender.com/api/eth-deposit", {
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
      const TOAST_ID = "error-deposit-toast";

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

  const headingStyle = {
    fontWeight: 700,
    fontSize: '1.8rem',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#0f172a',
  };

  const subTextStyle = {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: '2rem',
    fontSize: '0.95rem',
  };



  return (
    <>
      <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
        {/* Main Fields */}
        <Grid
          mb='20px'
          gridTemplateColumns={{ xl: "repeat(3, 1fr)", "2xl": "1fr 0.46fr" }}
          gap={{ base: "20px", xl: "20px" }}
          display={{ base: "block", xl: "grid" }}>
          <Flex
            flexDirection='column'
            gridArea={{ xl: "1 / 1 / 2 / 3", "2xl": "1 / 1 / 2 / 2" }}
            mb="5">
            <Banner />
            <Flex direction="column">
              {/* Toggle Menu */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '2rem',
                  marginBottom: '1rem',
                }}
              >
                <button
                  onClick={() => setActiveTab('fund')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '10px 0 0 10px',
                    background: activeTab === 'fund' ? '#1d4ed8' : '#e2e8f0',
                    color: activeTab === 'fund' ? '#fff' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Fund Wallet
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '0 10px 10px 0',
                    background: activeTab === 'withdraw' ? '#10b981' : '#e2e8f0',
                    color: activeTab === 'withdraw' ? '#fff' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Withdraw
                </button>
              </div>

              {/* Card Container */}
              <div
                style={{
                  maxWidth: '600px',
                  margin: '1rem auto',
                  padding: '2.5rem',
                  backgroundColor: '#fff',
                  border: activeTab === 'fund' ? '1px solid #1d4ed8' : '1px solid #10b981',
                  borderRadius: '16px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                  fontFamily: `'Inter', sans-serif`,
                }}
              >
                {activeTab === 'fund' ? (
                  <>
                    {/* Fund Wallet Form */}
                    <h2 style={headingStyle}>Fund Your Wallet</h2>
                    <p style={subTextStyle}>
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
                        <label style={labelStyle}>Amount (ETH)</label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="e.g. 0.5"
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
                  </>
                ) : (
                  <>
                    {/* Withdraw Form */}
                    <h2 style={headingStyle}>Withdraw Funds</h2>
                    <p style={subTextStyle}>
                      Convert your ETH balance to USD and withdraw to your account.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault(); // Prevent page refresh
                        setIsEthOpen(true);    // Open modal
                      }}
                    >
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Available Balance (ETH)</label>
                        <div style={inputStyle}>{ethBalance}</div>
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Withdrawal Amount (ETH)</label>
                        <input
                          type="number"
                          name="withdrawAmount"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          required
                          placeholder="e.g. 0.1"
                          style={inputStyle}
                        />
                      </div>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>You Will Receive (USD)</label>
                        <div style={{ ...inputStyle, backgroundColor: '#f1f5f9' }}>
                          ${convertedUSD}
                        </div>
                      </div>

                      <button
                        type="submit"
                        isLoading={isWithdrawing}
                        isDisabled={isWithdrawing}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '1rem',
                          background: 'linear-gradient(to right, #059669, #10b981)',
                          color: '#fff',
                          border: 'none',
                          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                          transition: 'background 0.3s ease',
                          cursor: isWithdrawing ? 'not-allowed' : 'pointer',
                          opacity: isWithdrawing ? 0.6 : 1,
                        }}
                      >
                        {isWithdrawing ? <Spinner animation="border" size="sm" className="text-white" /> : 'Withdraw'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </Flex>

          </Flex>
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
          >
            <TradingViewWidget />
          </Flex>

        </Grid>
        {/* Delete Product */}
      </Box>
      <ConfirmPinModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSubmit}
        userId={userId}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      {/*  */}
      <ConfirmPinModal
        isOpen={isEthOpen}
        onClose={() => setIsEthOpen(false)}
        onSuccess={handleWithdraw}
        userId={userId}
        isLoading={isWithdrawing}
        setIsLoading={setIsWithdrawing}
      />
    </>
  );
}
