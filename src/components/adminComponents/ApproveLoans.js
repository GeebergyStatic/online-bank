import React, { useState, useEffect } from 'react';
import { useUserContext } from 'userContextProvider/UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const LoansList = () => { // Rename the function to start with an uppercase letter
  const { userData } = useUserContext();
  const agentID = userData.agentID;
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      const response = await axios.get(`https://online-bank-qulz.onrender.com/api/pending-loans/${agentID}`);
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching Loans:", error);
      console.log(error.response?.data?.message || "Failed to load Loans.");
    }
  };

  // Update transaction status
  const changePaymentStatus = async (transactionReference, status, txId) => {
    setIsLoading(true);
    try {
      await axios.put(`https://online-bank-qulz.onrender.com/api/update-transaction/${transactionReference}`, { status });
      toast.success(`Transaction marked as ${status}!`);
      setIsLoading(false);
      setLoans(loans.filter(tx => tx._id !== txId)); // Remove from UI after update
    } catch (error) {
      toast.error("Failed to update transaction: " + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };

  const approveLoan = async (transactionReference, status, txId) => {
    setIsLoading(true);
    try {
      await axios.put(`https://online-bank-qulz.onrender.com/api/update-loan-transaction/${transactionReference}`, { status });
      toast.success(`Transaction marked as ${status}!`);
      setIsLoading(false);
      setLoans(loans.filter(tx => tx._id !== txId)); // Remove from UI after update
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
      <h1 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '0.8rem' }}>Pending Loan Applications</h1>
      <p style={{ color: '#ffc107', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        <FontAwesomeIcon style={{ marginRight: '8px' }} icon={faInfoCircle} />
        This is where all your clients’ loan applications are listed. You can approve or deny them and it will reflect on their end.
      </p>

      <div>
        {loans.length === 0 ? (
          <p style={{ color: '#ffc107' }}>No pending loan applications found.</p>
        ) : (
          loans.map((tx) => (
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

              {tx.fileUrl && (
                <img
                  src={tx.fileUrl}
                  alt="Screenshot Preview"
                  style={{
                    width: '150px',
                    borderRadius: '6px',
                    marginTop: '0.5rem',
                  }}
                />
              )}

              {isLoading ? (
                <div style={{ marginTop: '0.5rem' }}>
                  <Spinner animation="border" size="sm" variant="light" />
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => {
                      approveLoan(tx.transactionReference, 'success', tx._id);
                    }}
                    style={{
                      backgroundColor: '#28a745',
                      border: 'none',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Mark as Approved
                  </button>

                  <button
                    onClick={() => changePaymentStatus(tx.transactionReference, "failed", tx._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      border: 'none',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
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

export default LoansList;
