import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ import useLocation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingScreen from "loadingScreen/loadingScreen";

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
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeout = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ current route

  const fetchUserData = useCallback(async (userId) => {
    setIsLoading(true);

    loadingTimeout.current = setTimeout(() => {
      setIsLoading(false);
      toast.error("Check your internet connection and refresh the page.", {
        className: "custom-toast",
      });
    }, 15000);

    try {
      const response = await fetch(
        `https://online-bank-qulz.onrender.com/api/userDetail/${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      setUserData({
        avatar: data.avatar,
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phoneNo: data.phone,
        occupation: data.occupation,
        country: data.country,
        currencySymbol: data.currencySymbol,
        accountType: data.accountType,
        accountNumber: data.accountNumber,
        balance: data.balance,
        deposit: data.deposit,
        earnings: data.earnings,
        monthlyEarnings: data.monthlyEarnings,
        previousMonthlyEarnings: data.previousMonthlyEarnings,
        monthlySpent: data.monthlySpent,
        ethBalance: data.ethBalance,
        virtualCard: data.virtualCard,
        dateOfBirth: data.dateOfBirth,
        userId: data.userId,
        agentID: data.agentID,
        isOwner: data.isOwner,
        agentCode: data.agentCode,
        isUserActive: data.isUserActive,
        hasPaid: data.hasPaid,
      });
    } catch (error) {
      // toast.error("Failed to load user data.");
      console.error("Error fetching user data:", error);
    } finally {
      clearTimeout(loadingTimeout.current);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    // ✅ Prevent redirect if already on auth page
    // const authPaths = ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password", "/auth/reset-password"];
    const isOnAuthPage = location.pathname.startsWith("/auth/");

    if (!storedUserId) {
      if (!isOnAuthPage) {
        const TOAST_ID = "session-toast";

        if (!toast.isActive(TOAST_ID)) {
          toast.error("Session expired. Redirecting to sign-in...", {
            toastId: TOAST_ID,
            className: "custom-toast",
          });
        }


        setTimeout(() => {
          navigate("/auth/sign-in");
        }, 1500);
      }
      setIsLoading(false);
      return;
    }

    fetchUserData(storedUserId);
  }, [fetchUserData, navigate, location.pathname]);

  return (
    <UserContext.Provider value={{ userData, setUserData, isLoading, setIsLoading }}>
      {isLoading && <LoadingScreen />}
      {!isLoading && children}
    </UserContext.Provider>
  );
};
