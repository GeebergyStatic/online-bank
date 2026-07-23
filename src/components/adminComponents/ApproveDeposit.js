import React, { useState, useEffect } from "react";
import { useUserContext } from "userContextProvider/UserRoleContext";
import { Spinner } from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

const DepositList = () => {
  const { userData } = useUserContext();
  const agentID = userData.agentID;
  const [deposits, setDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pending deposits
  const fetchPendingDeposits = async () => {
    try {
      const response = await axios.get(`https://online-bank-qulz.onrender.com/api/pending-deposits/${agentID}`);
      setDeposits(response.data);
    } catch (error) {
      console.log("Error fetching deposits: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchPendingDeposits();
  }, []);

  // Update transaction status
  const changePaymentStatus = async (transactionReference, status, txId) => {
    setIsLoading(true);
    try {
      await axios.put(`https://online-bank-qulz.onrender.com/api/update-transaction/${transactionReference}`, { status });
      toast.success(`Transaction marked as ${status}!`);
      setIsLoading(false);
      setDeposits(deposits.filter(tx => tx._id !== txId)); // Remove from UI after update
    } catch (error) {
      toast.error("Failed to update transaction: " + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };


  const approveEthDeposit = async (transactionReference, status, txId) => {
    setIsLoading(true);
    try {
      await axios.put(`https://online-bank-qulz.onrender.com/api/update-eth-transaction/${transactionReference}`, { status });
      toast.success(`Transaction marked as ${status}!`);
      setIsLoading(false);
      setDeposits(deposits.filter(tx => tx._id !== txId)); // Remove from UI after update
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
    <div className="crypto-deposit-container">
      <ToastContainer />
      <h1 className="section-title">Crypto Deposit Requests</h1>
      <span className="info-text">
        <FontAwesomeIcon className="mx-2" icon={faInfoCircle} />
        This is where all your clients' pending deposits are. You can approve or deny them. It will reflect accordingly on the client side.
      </span>

      <div className="custom-task-list">
        {deposits.length === 0 ? (
          <p className="no-deposits-text">No pending deposits found.</p>
        ) : (
          deposits.map((tx) => (
            <div key={tx.transactionReference} className="custom-task-card">
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
                  className="proof-image"
                />
              )}

              {isLoading ? (
                <div className="spinner-wrapper">
                  <Spinner animation="border" size="sm" variant="primary" />
                </div>
              ) : (
                <div className="action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => {
                      if (tx.description === 'ETH Deposit') {
                        approveEthDeposit(tx.transactionReference, 'success', tx._id);
                      } else {
                        changePaymentStatus(tx.transactionReference, 'success', tx._id);
                      }
                    }}
                  >
                    Mark as Approved
                  </button>

                  <button
                    className="decline-btn"
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

export default DepositList;
