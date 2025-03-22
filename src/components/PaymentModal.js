import React, { useState, useContext, useEffect } from 'react';
import { useUserContext } from './UserRoleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import { Form, Button, Alert } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import PaymentBox from './PaymentBox';
import Loading from './Loading';


const PaymentModal = () => {
  const { userData, currentUser } = useUserContext();
  const userEmail = userData.email;
  const userID = userData.userID;
  const username = userData.fullName;
  const agentCode = userData.agentCode;
  const [fundAmount, setFundAmount] = useState('');
  const [selectedFundValue, setSelectedFundValue] = useState('');
  const [fundAddress, setFundAddress] = useState(null);
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [tetherInfo, setTetherInfo] = useState({ usdtAddress: '', usdtMemo: '' });
  const [isFundBtnLoading, setIsFundBtnLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // 
  const [formData, setFormData] = useState({
    cryptoWallet: "ETH",
    paymentProof: null,
  });

  const handleFileChange = (e) => {
    setFormData({ ...formData, paymentProof: e.target.files[0] });
  };

  useEffect(() => {
    if (!agentCode) return; // Ensure agentCode is available before making the request
  
    fetch(`https://broker-app-4xfu.onrender.com/api/fetchWallets?agentCode=${agentCode}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWalletAddresses(data);
        } else {
          setWalletAddresses([]); // Fallback if response is not an array
        }
      })
      .catch(err => {
        console.error('Failed to fetch wallet addresses:', err);
        setWalletAddresses([]);
      });
  }, [agentCode]); // Add agentCode as a dependency to re-fetch if it changes
  

  const generateTransactionReference = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let customReference = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        customReference += characters[randomIndex];
    }
    return customReference;
    }
  

  const saveBtcTransactionData = async (email, amount, userID, status, paymentID, username) => {
  
    const reference = uuidv4();
    const txDetails = {
      transactionReference: `tx-${reference}`,
      email,
      amount,
      userID,
      status, // Include the status field
      timestamp: new Date(),
      transactionType: 'Deposit',
      paymentID,
      username,
      description: 'Deposit',
    };
  
    try {
      const response = await fetch(`https://broker-app-4xfu.onrender.com/api/createTransactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(txDetails),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save BTC transaction: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('BTC transaction saved successfully:', data);
    } catch (error) {
      console.error('Error saving BTC transaction:', error.message);
    }
  };
  
  // Save temp crypto transaction
  const saveTempCryptoData = async (userID, payment_status, pay_address, price_amount, paymentID, username) => {
  
    const paymentData = {
      userID,
      payment_status,
      pay_address,
      price_amount,
      paymentID,
      username,
      description: 'Deposit',
    };
  
    try {
      const response = await fetch(`https://broker-app-4xfu.onrender.com/api/saveCryptoPayments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save crypto payment: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Crypto payment saved successfully:', data);
    } catch (error) {
      console.error('Error saving crypto payment:', error.message);
    }
  };
  

  const handleFundDropdownChange = (e, amount) => {
    if (fundAmount < 10) {
      toast.warning('Fund amount must be at least $10.', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    const selectedOption = e.target.value;
    setSelectedFundValue(selectedOption);
  
    // Fetch the corresponding wallet address (and memo for tether) based on the selection
    const selectedWallet = walletAddresses.find(wallet => wallet.type === selectedOption);
  
    if (selectedOption.toLowerCase() === 'xrp' && selectedWallet) {
      setTetherInfo({ usdtAddress: selectedWallet.address, usdtMemo: selectedWallet.memo });
      setFundAddress(null); // Hide the single address input for Tether case
      // handleSaveTransaction(amount);
    } else {
      setFundAddress(selectedWallet ? selectedWallet.address : null);
      setTetherInfo({ usdtAddress: '', usdtMemo: '' });
      // handleSaveTransaction(amount);
    }
  };
  

  const handleSaveTransaction = (amount) => {
    // Here, you would generate a payment address or save the transaction
    console.log(`Saving transaction for amount: ${amount}`);
    const paymentID = generateTransactionReference(10);
  
    saveBtcTransactionData(userEmail, amount, userID, 'pending', `pID-${paymentID}`, username);
    saveTempCryptoData(userID, 'pending', 'random', amount, `pID-${paymentID}`, username);
  };
  
  const handleDebitUser = async (amount) => {
    const user_balance = userData.balance;
    if(user_balance && amount && user_balance >= amount){
      // Implement the logic to debit the user for the specific amount
      console.log(`Debiting user for amount: ${amount}`);
      try {
        const response = await axios.post('https://broker-app-4xfu.onrender.com/api/debitUser', {
          userId: userID,
          fee: parseFloat(amount), // Ensure fee is a number
        });

        if (response.status === 200) {
          console.log('User debited successfully!');
        }
      } catch (err) {
        console.error('Error adding participant:', err);
      }
    }
    else{
      toast.error(`Insufficient Funds!`, {
        toastId: 'toast-wt-fail',
      });
    }
    

  };
  

  const generateFundAddress = (amount) => {
    setIsFundBtnLoading(true);
    // Simulating API call
    if (fundAddress){
      setTimeout(() => {
        setShowAddress(true);
        handleSaveTransaction(amount);
        setIsFundBtnLoading(false);
      }, 2000);
    }
    else{
      setShowAddress(false);
      setIsFundBtnLoading(false);
      toast.warning('Please select a payment method!', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    
  };

  const handleCopyFund = (value) => {
    navigator.clipboard.writeText(value);
    // Optionally, add a toast notification here
    toast.info('Info Copied Successfully!', {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  return (
    <div className='container-large'>
      <div className='container'>
      <div
      className="main-container p-4"
      style={{
        maxWidth: "900px",
        background: "#d6dee8",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        color: "#2c3e50",
        textAlign: "center",
      }}
    >
      {/* ⚠️ Warning Section */}
      <Alert variant="danger" className="fw-bold">
        ⚠️ Please note: The only accepted digital currency is **Ethereum (ETH)**.  
        DeepSea **won't be liable** for any loss of funds.
      </Alert>

      <h2 className="fw-bold">Deposit and Submit Proof</h2>
      <p className="mb-4">Top up your balance securely by submitting proof of payment.</p>

      <Form className="text-start">
        {/* Select Crypto Wallet */}
        <Form.Group className="mb-3">
          <Form.Label>Select Crypto Wallet</Form.Label>
          <Form.Select
            name="cryptoWallet"
            value={formData.cryptoWallet}
            disabled
            style={{
              background: "#c9d3dd",
              color: "#2c3e50",
              border: "1px solid #a4b0be",
              cursor: "not-allowed",
            }}
          >
            <option value="ETH">Ethereum (ETH)</option>
          </Form.Select>
        </Form.Group>

        {/* Upload Payment Proof */}
        <Form.Group className="mb-4">
          <Form.Label>Upload Payment Proof</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              background: "#c9d3dd",
              color: "#2c3e50",
              border: "1px solid #a4b0be",
            }}
          />
        </Form.Group>

        {/* Submit Button */}
        <Button type="submit" variant="dark" className="w-100">
          🚀 Submit Proof
        </Button>
      </Form>
    </div>
      </div>
    </div>
  );
};

export default PaymentModal;
