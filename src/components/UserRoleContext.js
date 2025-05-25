import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import ScreenLoad from "./screenLoad"; 

const UserContext = createContext(null);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = useRef(null); // ✅ Use a ref for timeout

  const fetchUserData = useCallback(async (userId) => {
    setIsLoading(true);

    try {
      loadingTimeout.current = setTimeout(() => {
        setIsLoading(false);
        toast.error("Check your internet connection and refresh the page.", {
          className: "custom-toast",
        });
      }, 15000); 

      const response = await fetch(`https://nft-broker.onrender.com/api/userDetail/${userId}`);
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

      clearTimeout(loadingTimeout.current);
    } catch (error) {
      toast.error("Failed to load user data.");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserData(user.uid);
      } else {
        setCurrentUser(null);
        setUserData({});
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout.current);
    };
  }, [fetchUserData]);

  return (
    <UserContext.Provider value={{ userData, setUserData, currentUser, isLoading, setIsLoading }}>
      {isLoading && <ScreenLoad />}
      {children}
      <ToastContainer />
    </UserContext.Provider>
  );
};
