import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { Form, Button } from "react-bootstrap";
import { useUserContext } from './UserRoleContext';
import {auth, db} from '../firebase';
import {doc, getDoc, updateDoc, getFirestore, collection, addDoc} from 'firebase/firestore';
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import BtcWithdrawList from './btcWithdraw';
import "react-toastify/dist/ReactToastify.css";
import myRedImage from '../red-loader.gif';
import Loading from './Loading';




const WalletBalance = (props) => {
const { userData, currentUser } = useUserContext();
const userID = userData.userID;
const username = userData.fullName;
const userBalance = userData.balance;
const userEmail = userData.email;
const userDeposit = userData.deposit;

const user = auth.currentUser;

const [isLoading, setIsLoading] = useState(false);
const [recipientName, setRecipientName] = useState('');           
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [txReference, setTxReference] = useState('');
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [inUseReference, setInUseReference] = useState('');
  const [transferResponse, setTransferResponse] = useState('');
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  // 
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    bankName: "",
    swiftCode: "",
    bankAddress: "",
    ethAmount: "",
    additionalInfo: "",
    walletName: "",
    walletAddress: "",
  });

   // Handle input change
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
   // Example non-decimal number
  // State to manage the selected value of the dropdown
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedStarterValue, setSelectedStarterValue] = useState('');
  const [memoTag, setMemoTag] = useState('');

  const generateTransactionReference = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let customReference = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        customReference += characters[randomIndex];
    }
    return customReference;
    }
    
    const [paymentAddress, setPaymentAddress] = useState('');
    const formattedBalance  = (Number(userBalance) + 0.0).toFixed(2);
  

  //  save crypto transaction (deposit)
//  save crypto transaction (deposit)
const saveBtcTransactionData = async (email, amount, userID, status, paymentID, username) => {
  // const db = getFirestore();
  // const transactionsCollection = collection(db, 'transactions');
  const txReference = generateTransactionReference(10); // Assuming you want a reference of length 10

  if(user){
    const txDetails = {
      transactionReference: 'tx-' + txReference,
      email,
      amount,
      userID,
      status, // Include the status field
      timestamp: new Date(),
      transactionType: 'Withdrawal',
      paymentID,
      username,
      description: 'Withdrawal',
    };
    await fetch(`https://broker-app-4xfu.onrender.com/api/createTransactions`,
   {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any other headers as needed
    },
    body: JSON.stringify(txDetails),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      try {
    
      } catch (error) {
        console.log('Error adding transaction document: ', JSON.stringify(error));
      }
    })
    .catch(error => {
      console.log('Error:', JSON.stringify(error.message));
    });
  }
  
};
// end of crypto tx record

// save temp crypto tx
const saveTempCryptoData = async (userID, payment_status, pay_address, price_amount, paymentID, username) => {
  // const db = getFirestore();
  // const transactionsCollection = collection(db, 'transactions');
  // const txID = uuidv4(); 
  if(user){
    const paymentData = {
      userID,
      payment_status,
      pay_address,
      price_amount,
      paymentID,
      username,
      description: 'Withdrawal',
    };
    await fetch(`https://broker-app-4xfu.onrender.com/api/saveCryptoPayments`,
   {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any other headers as needed
    },
    body: JSON.stringify(paymentData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
    })
    .then(data => {
      try {
        
    
      } catch (error) {
        
      }
    })
    .catch(error => {
      
    });
  }
  
};

const handleDebitUser = async (amount) => {
  if (userBalance && amount && userBalance >= amount) {
    console.log(`Debiting user for amount: ${amount}`);
    try {
      const response = await axios.post(
        'https://broker-app-4xfu.onrender.com/api/debitUser',
        {
          userId: userID,
          fee: parseFloat(amount), // Ensure fee is a number
        }
      );

      if (response.status === 200) {
        console.log('User debited successfully!');
        return true; // Indicate success
      } else {
        throw new Error('Failed to debit user.');
      }
    } catch (err) {
      console.error('Error debiting user:', err);
      throw new Error('Error debiting user.');
    }
  } else {
    throw new Error('Insufficient Funds!');
  }
};


  // Function to handle the change of the dropdown value
  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleCryptoDropdownChange = (event) => {
    setSelectedStarterValue(event.target.value);
  };


  const completeBtcPayment = async () => {
    setIsLoading(true);
    setIsBtnDisabled(true);
  
    try {
      // Validation checks
      if (selectedValue.trim() === '') {
        throw new Error('Select a withdrawal option!');
      }
      if (selectedStarterValue === 'xrp' && memoTag.trim() === '') {
        throw new Error('Invalid memo tag!');
      }
      if (userBalance < amount) {
        throw new Error('Insufficient Funds!');
      }
      if (amount < 20) {
        throw new Error('Minimum withdrawal is $20!');
      }
      if (selectedValue === 'crypto' && selectedStarterValue.trim() === '') {
        throw new Error('Select a cryptocurrency!');
      }
      if (userAddress.trim() === '') {
        throw new Error('Receiving account field cannot be empty!');
      }
      if (userDeposit < 1) {
        throw new Error('To withdraw, you must first fund your account with at least 10% of the withdrawal amount!');
      }
  
      // Debit user
      await handleDebitUser(amount);
  
      // Save transaction data
      const paymentID = generateTransactionReference(10);
      await saveBtcTransactionData(userEmail, amount, userID, 'pending', `pID-${paymentID}`, username);
      await saveTempCryptoData(userID, 'pending', 'random', amount, `pID-${paymentID}`, username);
  
      // Success notification
      toast.success('Withdrawal request submitted successfully!', {
        toastId: 'toast-wt-success',
      });
  
      // Reload page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      // Error notification
      toast.error(error.message, {
        toastId: 'toast-wt-error',
      });
    } finally {
      // Reset loading and button state
      setIsLoading(false);
      setIsBtnDisabled(false);
    }
  };
  
  
  

  return (
    <div className='container-large'>
      <div className='container'>
      <div
      className="main-container p-4"
      style={{
        maxWidth: "900px",
        background: "#d6dee8", // Light blue-gray
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        color: "#2c3e50",
        textAlign: "center",
      }}
    >
      <h2 className="fw-bold">WITHDRAW FUNDS</h2>

      {/* Selection Buttons */}
      {!selectedMethod && (
        <div className="mt-4 d-flex justify-content-between">
          <Button
            variant="dark"
            className="w-50 me-2"
            onClick={() => setSelectedMethod("bank")}
            style={{
              background: "linear-gradient(90deg, #5c9ff5, #3366cc)",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            🏦 Bank Transfer
          </Button>
          <Button
            variant="dark"
            className="w-50 ms-2"
            onClick={() => setSelectedMethod("wallet")}
            style={{
              background: "linear-gradient(90deg, #5c9ff5, #3366cc)",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            💳 Wallet Transfer
          </Button>
        </div>
      )}

      {/* Bank Transfer Form */}
      {selectedMethod === "bank" && (
        <>
          <h4 className="mt-4">PLEASE PROVIDE YOUR BANK DETAILS</h4>
          <Form className="text-start mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Account Name</Form.Label>
              <Form.Control
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="Enter account name"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Swift Code</Form.Label>
              <Form.Control
                type="text"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleChange}
                placeholder="Enter SWIFT code"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bank Address</Form.Label>
              <Form.Control
                type="text"
                name="bankAddress"
                value={formData.bankAddress}
                onChange={handleChange}
                placeholder="Enter bank address"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ETH Withdrawal Amount</Form.Label>
              <Form.Control
                type="number"
                name="ethAmount"
                value={formData.ethAmount}
                onChange={handleChange}
                placeholder="Enter amount in ETH"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Additional Info</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Enter any extra details..."
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Button type="submit" variant="dark" className="w-100">
              🚀 Withdraw
            </Button>
          </Form>
        </>
      )}

      {/* Wallet Transfer Form */}
      {selectedMethod === "wallet" && (
        <>
          <h4 className="mt-4">PLEASE PROVIDE YOUR WALLET DETAILS</h4>
          <Form className="text-start mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Wallet Name</Form.Label>
              <Form.Control
                type="text"
                name="walletName"
                value={formData.walletName}
                onChange={handleChange}
                placeholder="Enter wallet name"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Wallet Address</Form.Label>
              <Form.Control
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleChange}
                placeholder="Enter wallet address"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ETH Withdrawal Amount</Form.Label>
              <Form.Control
                type="number"
                name="ethAmount"
                value={formData.ethAmount}
                onChange={handleChange}
                placeholder="Enter amount in ETH"
                required
                style={{ background: "#c9d3dd", color: "#2c3e50", border: "1px solid #a4b0be" }}
              />
            </Form.Group>

            <Button type="submit" variant="dark" className="w-100">
              🚀 Withdraw
            </Button>
          </Form>
        </>
      )}
    </div>
      </div>
    </div>
  );
  
};

export default WalletBalance;
