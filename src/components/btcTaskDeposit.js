import React, { useState, useEffect } from 'react';
import { useUserContext } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';

const BtcTaskList = () => { // Rename the function to start with an uppercase letter
  const { userData, currentUser } = useUserContext();
  const agentID = userData.agentID;
  const [tasks, setTasks] = useState([]);
  const [btcTx, setBtcTx] = useState([]);

  useEffect(() => {
    fetchPendingBtcDeposits(agentID);
  }, []);

  const fetchPendingBtcDeposits = async (agentID) => {
    try {
      const response = await axios.get(`https://broker-app-4xfu.onrender.com/api/getBtcDeposits/${agentID}`);
      const transactions = response.data; // axios automatically parses JSON responses
      setBtcTx(transactions);
    } catch (error) {
      console.error('Error fetching BTC deposits:', error.message);
    }
  };

  // const fetchPendingBtcDeposits = async () => {
  //   try {
  //     const response = await axios.get(`https://broker-app-4xfu.onrender.com/api/getBtcDeposits`);
  //     const transactions = response.data; // axios automatically parses JSON responses
  //     setBtcTx(transactions);
  //   } catch (error) {
  //     console.error('Error fetching BTC deposits:', error.message);
  //   }
  // };
  

  // change state of btc tasks (transactions and temp data);
  const changePaymentStatus = async (transactionId, newStatus, userId, amount) => {
    try {
      const response = await fetch(`https://broker-app-4xfu.onrender.com/api/updatePaymentStatusAndDelete/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus, userId, amount }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If the request is successful, call another function
      toast.success(`Documents Updated!`, {
        toastId: 'toast-change-success',
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error(`Failed to update documents!`, {
        toastId: 'toast-change-failed',
      });
    }
  };


  return (
    <div>
    <ToastContainer />
    <h1 className='text-white'>Crypto Deposit Requests</h1>
    <div className="custom-task-list d-block">
  <>
    {btcTx.map((tx) => ( 
      <div key={tx.id} className="custom-task-card text-dark">
        {/* Display transaction details */}
        <p><span className='fw-bold'>Transaction ID:</span> {tx.paymentID}</p>
        <p><span className='fw-bold'>Amount:</span> {tx.price_amount}</p>
        <p><span className='fw-bold'>Status:</span> {tx.payment_status}</p>
        <p><span className='fw-bold'>User ID:</span> {tx.userID}</p>
        <p><span className='fw-bold'>Username:</span> {tx.username}</p>
        <p><span className='fw-bold'>Time of payment:</span> {tx.timestamp}</p>
        <p><span className='fw-bold'>Payment Description:</span> {tx.description}</p>
        
        {/* Buttons to change payment status */}
        <div className='d-flex justify-content-between align-items-center'>
        <button className='btn btn-success' onClick={() => changePaymentStatus(tx.paymentID, 'success', tx.userID, tx.price_amount)}>Mark as Approved</button>
        <button className='btn btn-danger' onClick={() => changePaymentStatus(tx.paymentID, 'failed', tx.userID, tx.price_amount)}>Mark as Declined</button>
        </div>
      </div>
    ))}
  </> 
    </div>
  </div>
  );
};

export default BtcTaskList;
