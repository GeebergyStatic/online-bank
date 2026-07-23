import React, { useState, useEffect } from 'react';
import { useUserContext } from 'userContextProvider/UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const WithdrawList = () => { // Rename the function to start with an uppercase letter
  const { userData } = useUserContext();
  const agentID = userData.agentID;
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pending NFT deposits
  const fetchPendingWithdrawals = async () => {
    try {
      const response = await axios.get(`https://online-bank-qulz.onrender.com/api/pending-withdrawals/${agentID}`);
      setWithdrawals(response.data);
    } catch (error) {
      console.log("Error fetching withdrawals: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchPendingWithdrawals();
  }, []);

  // Update transaction status
  const changePaymentStatus = async (transactionReference, status, txId) => {
    setIsLoading(true);
    try {
      await axios.put(`https://online-bank-qulz.onrender.com/api/update-transaction/${transactionReference}`, { status });
      toast.success(`Transaction marked as ${status}!`);
      setIsLoading(false);
      setWithdrawals(withdrawals.filter(tx => tx._id !== txId)); // Remove from UI after update
    } catch (error) {
      toast.error("Failed to update transaction: " + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

  const approveWithdrawal = async (transactionReference, status, txId) => {
    setIsLoading(true);
    try {
      await axios.put(`https://online-bank-qulz.onrender.com/api/update-withdrawal-transaction/${transactionReference}`, { status });
      toast.success(`Transaction marked as ${status}!`);
      setIsLoading(false);
      setWithdrawals(withdrawals.filter(tx => tx._id !== txId)); // Remove from UI after update
    } catch (error) {
      toast.error("Failed to update transaction: " + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

  const containerStyle = {
    // position: 'absolute',
    minHeight: '100vh',
    maxHeight: '700px',
    background: "linear-gradient(90deg, rgba(200, 220, 240, 0.9) 0%, rgba(220, 230, 250, 0.85) 100%)",
    overflow: 'scroll',
    color: '#000',
    padding: '30px',
    // borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    // marginTop: '20px',
  };


  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '8px', color: '#fff' }}>
      <ToastContainer />
      <h1 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.8rem' }}>Crypto Withdrawal Requests</h1>
      <p style={{ color: '#ffc107', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        <FontAwesomeIcon className='mx-2' icon={faInfoCircle} />
        This is where all your clients' withdrawal requests are. You can approve or deny them, and the status will update on their end accordingly.
      </p>

      <div style={{ display: 'block' }}>
        {withdrawals.length === 0 ? (
          <p style={{ color: '#ffc107' }}>No pending withdrawals found.</p>
        ) : (
          withdrawals.map((tx) => (
            <div
              key={tx.transactionReference}
              style={{
                backgroundColor: '#2b2b2b',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                color: '#f8f9fa',
              }}
            >
              <p><strong>Transaction ID:</strong> {tx.transactionReference}</p>
              <p><strong>Amount:</strong> {tx.amount}</p>
              <p><strong>Status:</strong> {tx.status}</p>
              <p><strong>User ID:</strong> {tx.userID}</p>
              <p><strong>Time of Payment:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
              <p><strong>Payment Description:</strong> {tx.description}</p>
              {tx.walletAddress && <p><strong>Wallet Address:</strong> {tx.walletAddress}</p>}

              {isLoading ? (
                <div style={{ marginTop: '0.5rem' }}>
                  <Spinner animation="border" size="sm" variant="light" />
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.8rem' }}>
                  <button
                    style={{
                      backgroundColor: '#28a745',
                      border: 'none',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => approveWithdrawal(tx.transactionReference, "success", tx._id)}
                  >
                    Mark as Approved
                  </button>
                  <button
                    style={{
                      backgroundColor: '#dc3545',
                      border: 'none',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => changePaymentStatus(tx.transactionReference, "failed", tx._id)}
                  >
                    Mark as Declined
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>

  );
};

export default WithdrawList;
