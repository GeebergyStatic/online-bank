import React, { useState, useEffect } from 'react';
import { useUserContext } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS

const TransactionList = () => {
  const { userData } = useUserContext();
  const [userTransactions, setUserTransactions] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const userID = userData?.userID; // Ensure userID exists

  useEffect(() => {
    // Fetch the user's transactions when the component mounts
    if (userID) fetchUserTransactions(userID);
  }, [userID]);

  const fetchUserTransactions = async (userID) => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await fetch(
        `https://broker-app-4xfu.onrender.com/api/getUserTransactions?userID=${userID}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userTransactionsData = await response.json();
      // Sort transactions in descending order based on a timestamp field
      userTransactionsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setUserTransactions(userTransactionsData);
    } catch (error) {
      console.error('Error fetching user transactions: ', error);
      toast.error("Failed to fetch transactions. Please try again later.");
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  return (
    <div className='container-large'>

      <ToastContainer />
    <div className='container'>
      

  <div
    className="transaction-list main-container p-4 mt-5"
    style={{
      background: "rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
      borderRadius: "12px",
      padding: "20px",
      backdropFilter: "blur(12px)",
    }}
  >
    {loading ? (
      <div className="text-center p-5">
        <i className="fa fa-spinner fa-spin fa-3x fa-fw text-light"></i>
        <p className="text-dark mt-3">Loading Transactions...</p>
      </div>
    ) : (
      <>
        {userTransactions.length === 0 ? (
          <p className="text-center text-dark">No transactions found.</p>
        ) : (
          userTransactions.map((transaction, index) => (
            <div
              key={index}
              className="p-3 mt-3"
              style={{
                borderRadius: "12px",
                padding: "15px",
                background: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(15px)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                borderLeft: `5px solid ${
                  transaction.status === "success"
                    ? "#28a745"
                    : transaction.status === "pending"
                    ? "#ffc107"
                    : "#dc3545"
                }`,
                color:
                  transaction.status === "success"
                    ? "#28a745"
                    : transaction.status === "pending"
                    ? "#ffc107"
                    : "#dc3545",
              }}
            >
              <div className="transaction-reference">
                <span className="fw-bold">Transaction Reference:</span> {transaction.transactionReference}
              </div>
              <div className="tx-type fw-bold">{transaction.description}</div>
              <div className="transaction-details d-flex justify-content-between">
                <span>
                  Transaction{" "}
                  {transaction.status === "success"
                    ? "Successful"
                    : transaction.status === "pending"
                    ? "Pending"
                    : "Failed"}
                </span>{" "}
                <span>
                  Amount: <span className="fw-bold">${transaction.amount}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </>
    )}
  </div>
    </div>
</div>

  );
};

export default TransactionList;
