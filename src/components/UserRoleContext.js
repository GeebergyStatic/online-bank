// UserContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from "react-toastify";

// Create the UserContext
const UserContext = createContext(null);

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

// UserProvider component that wraps your app and provides user data
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    // Function to fetch user details from the API
    const fetchUserData = async (userId) => {
      try {
        const response = await fetch(`https://broker-app-4xfu.onrender.com/api/userDetail/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUserData({
          avatar: data.avatar,
          email: data.email,
          fullName: data.name,
          userID: data.userId,
          agentID: data.agentID,
          agentCode: data.agentCode,
          phoneNo: data.number,
          role: data.role,
          isUserActive: data.isUserActive,
          hasPaid: data.hasPaid,
          deposit: data.deposit,
          currencySymbol: data.currencySymbol,
          country: data.country,
          balance: data.balance,
          referralsBalance: data.referralsBalance,
          referredUsers: data.referredUsers,
          referralCode: data.referralCode,
          returns: data.returns,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally, you can show a toast notification here
        // toast.error('Failed to fetch user data.');
      }
    };

    // Function to check if the user exists in the database
    const checkUserExists = async (userId) => {
      try {
        const response = await fetch(`https://broker-app-4xfu.onrender.com/api/userExists/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status) {
          await fetchUserData(userId);
        } else {
          console.log('User does not exist.');
          // Optionally, handle the case where the user does not exist
          // e.g., redirect to a signup page or show a message
        }
      } catch (error) {
        console.error('Error checking if user exists:', error);
        // Optionally, you can show a toast notification here
        // toast.error('Failed to verify user existence.');
      }
    };

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        checkUserExists(user.uid);
      } else {
        setCurrentUser(null);
        setUserData({});
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, currentUser }}>
      {children}
      <ToastContainer />
    </UserContext.Provider>
  );
};
