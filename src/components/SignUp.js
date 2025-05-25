// import useRef, useContext
import { useRef, useContext, useEffect, useState } from "react";
// import Context to get shared data.
import Context from "../Context";
// import validator to validate user's information.
import validator from "validator";
// import firebase authentication.
import { auth, realTimeDb, db } from "../firebase";
import {getAuth,createUserWithEmailAndPassword} from 'firebase/auth'
import { ref, set} from 'firebase/database'
// import uuid to generate id for users.
import { v4 as uuidv4 } from "uuid";
import { getFirestore, getDoc, setDoc, doc, updateDoc, collection, query, where, getDocs, increment } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getStorage, ref as Ref, getDownloadURL, listAll } from "firebase/storage";
import "react-toastify/dist/ReactToastify.css";
import {useLocation, useSearchParams} from 'react-router-dom';
import Loading from './Loading';
import Select from 'react-select';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import fetchCurrencies from "./fetchCurrencies";
import fetchCountries from "./fetchCountries";


function SignUp(props) {
  // get toggleModal functin from higher order components.
  const { toggleModal } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState('');
  const [refParam, setRefParam] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [country, setCountry] = useState("");

  const [currentSection, setCurrentSection] = useState(1);
  const [pin, setPin] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    currencySymbol: "",
    accountType: "",
    occupation: "",
    country: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentSection !== 3) setPin(""); // optional
  }, [currentSection]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    const loadCurrencies = async () => {
      const options = await fetchCurrencies();
      setCurrencyOptions(options);

      // If no currency set yet, default to NGN
      setFormData((prev) => ({
        ...prev,
        currencySymbol: prev.currencySymbol,
      }));
    };

    loadCurrencies();
  }, []);



  // country choose

  const [countryOptions, setCountryOptions] = useState([]);

  useEffect(() => {
    const fetchCountryData = async () => {
        try {
            setLoading(true); // Set loading to true before fetching
            const countries = await fetchCountries();
            setCountryOptions(countries);
        } catch (error) {
            console.error("Error fetching countries:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    fetchCountryData();
}, []);

const handleCountryChange = (selectedOption) => {
  setCountry(selectedOption.value);
  // console.log("Selected country:", selectedOption.value);
};

  const location = useLocation();

  // Extract referral code from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referralCode = params.get('ref');
    
    // Associate referral code with the sign-up process
    // This could involve storing the referral code in state or passing it to an API call
    setRefParam(referralCode);
  }, [location.search]);

  const [agentCode, setAgentCode] = useState("");

  // Get query parameters from the URL
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract agent_code or ag from the URL (e.g., ?agent_code=12345 or ?ag=12345)
    const code = searchParams.get("agent_code") || searchParams.get("ag");
    if (code) {
      setAgentCode(code);
    }
  }, [searchParams]);
  

  const handleInputChange = (field) => (e) => {
    const rawValue = e?.target?.value ?? e?.value ?? ""; // support Select & input
    const trimmedValue = typeof rawValue === "string" ? rawValue.trim() : rawValue;

    setFormData((prev) => ({
      ...prev,
      [field]: trimmedValue,
    }));
  };



  const maxPinLength = 4;
  const handleKeypadInput = (digit) => {
    if (pin.length < maxPinLength) {
      setPin((prev) => prev + digit);
    }
  };
  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (currentSection === 1) {
      const { firstName, lastName, currencySymbol, accountType, occupation, country } = formData;
      if (!firstName || !lastName || !currencySymbol || !accountType || !occupation || !country) {
        toast.error("Please fill out all fields in this section.", { className: "custom-toast" });
        return;
      }
    }

    if (currentSection === 2) {
      const { email, phone, username, password, confirmPassword } = formData;
      if (!email || !phone || !username || !password || !confirmPassword) {
        toast.error("Please fill out all fields in this section.", { className: "custom-toast" });
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.", { className: "custom-toast" });
        return;
      }
    }

    setCurrentSection((prev) => prev + 1);
  };

  const prevSection = () => setCurrentSection((prev) => Math.max(prev - 1, 1));



  // create refs to get user's email, user's password, user's confirm password.
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  /**
   * generate random avatar for demo purpose
   * @returns 
   */
  useEffect(() => {
    const fetchAvatars = async () => {
      const storage = getStorage();
      const avatarsRef = Ref(storage, 'avatars');

      try {
        const result = await listAll(avatarsRef);
        const downloadURLs = await Promise.all(
          result.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return url;
          })
        );

        setAvatars(downloadURLs);

        if (downloadURLs.length > 0) {
          // Select a random avatar from the list
          const randomIndex = Math.floor(Math.random() * downloadURLs.length);
          setSelectedAvatar(downloadURLs[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    fetchAvatars();
  }, []); // Run once when the component mounts


  /**
   * validate user's informatin.
   * @param {*} param0 
   * @returns 
   */
  const isSignupValid = ({ fullName, email, password, confirmPassword, countryCheck}) => {
    if (validator.isEmpty(fullName)){
      // alert("Please input your full name");
      toast.warning("Please input your full name", {
        position: toast.POSITION.TOP_CENTER,
        className: "custom-toast",
      });
      return false
    }
    if (!validator.isEmail(email)) {
      // alert("Please input your email");
      toast.warning("Please input a valid email", {
        position: toast.POSITION.TOP_CENTER,
        className: "custom-toast",
      });
      return false;
    }

    if (countryCheck.trim() === '') {
      // alert("Please select field");
      toast.warning("Please select country", {
        position: toast.POSITION.TOP_CENTER,
        className: "custom-toast",
      });
      return false;
    }

    if (validator.isEmpty(password) || !validator.isLength(password, {min: 6})) {
      // alert("Please input your password. You password must have at least 6 characters");
      toast.warning("Please input your password. Your password must have at least 6 characters", {
        position: toast.POSITION.TOP_CENTER,
        className: "custom-toast",
      });
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      // alert("Please input your confirm password");
      toast.warning("Please input your confirm password", {
        position: toast.POSITION.TOP_CENTER,
        className: "custom-toast",
      });
      return false;
    }
    if (password !== confirmPassword) {
      // alert("Confirm password and password must be the same");
      toast.warning("Confirm password and password must be the same", {
        position: toast.POSITION.TOP_CENTER,
        className: "custom-toast",
      });
      return false;
    }
    return true;
  };

  // Helper function to fetch data from API
  const fetchAPI = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    return response.json();
  };

  // Helper function to create user in backend
  const createUserInBackend = async (payLoad) => {
    return await fetchAPI('https://nft-broker.onrender.com/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payLoad),
    });
  };


  const checkAgentCode = async (agentCode) => {
    const data = await fetchAPI(`https://nft-broker.onrender.com/api/checkAgentCode/${agentCode}`);
    return data;
  };


  // Helper function to handle user creation
  const handleUserCreation = async (payLoad) => {
    await createUserInBackend(payLoad);
    localStorage.setItem('new', true);
    toast.success(`${payLoad.email} was created successfully! Please sign in with your created account`, {
      position: toast.POSITION.TOP_CENTER,
      className: "custom-toast",
    });
    setIsLoading(false);
    toggleModal(false);
  };




  // Main signup function
  // Main signup function
  const signup = async () => {
    const sanitizedData = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      username: formData.username.trim(),
      country: formData.country.trim(),
      accountType: formData.accountType.trim(),
      currencySymbol: formData.currencySymbol.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
      occupation: formData.occupation.trim(),
    };

    if (!isSignupValid(sanitizedData)) {
      return;
    }

    setIsLoading(true);

    try {
      let agentCodeData = null;
      if (agentCode) {
        agentCodeData = await checkAgentCode(agentCode);
        if (agentCodeData.status === 'false') {
          throw new Error(agentCodeData.message || 'Invalid Agent Code');
        }
      }

      // Build the final payload (no userId, backend generates it)
      const payLoad = {
        avatar: selectedAvatar,
        email: sanitizedData.email,
        name: sanitizedData.fullName,
        role: 'client',
        balance: 0,
        deposit: 0,
        isUserActive: false,
        agentCode: agentCode || 'none',
        hasPaid: false,
        country: sanitizedData.country,
        returns: 0,
        accountType: sanitizedData.accountType, 
        currencySymbol: sanitizedData.currencySymbol,
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        username: sanitizedData.username,
        phone: sanitizedData.phone,
        occupation: sanitizedData.occupation,
        password: sanitizedData.password,
        pin,
      };

      await handleUserCreation(payLoad); // No `user` object needed now
    } catch (error) {
      console.error('Signup Error:', error.message);
      setIsLoading(false);

      const errorMessage = error.message || 'An error occurred';
      if (errorMessage.includes('already exists')) {
        toast.error(`Cannot create your account, ${sanitizedData.email} already exists, please try again!`, {
          position: toast.POSITION.TOP_CENTER,
          className: "custom-toast",
        });
      } else if (!isOnline) {
        toast.error('Check your internet connection', {
          position: toast.POSITION.TOP_CENTER,
          className: "custom-toast",
        });
      } else {
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_CENTER,
          className: "custom-toast",
        });
      }
    }
  };

  
  



  return (
    <div className="signup">
  <ToastContainer />
      <div className="signup__form container">
        <DotLottieReact
          src="https://lottie.host/3728dfcd-8dde-4dac-85ef-af81816832fa/VZ6ZjLSV8l.lottie"
          loop
          autoplay
          style={{ width: '150px', height: '150px', margin: '0 auto' }}
        />
        <div className="signup__container d-flex">
          <div className="signup__title gradient-text">Sign Up</div>
        </div>

        {currentSection === 1 && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange("firstName")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange("lastName")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <Select
                value={
                  currencyOptions.find(
                    (option) => option.value === formData.currencySymbol
                  ) || null
                }
                onChange={(selected) =>
                  handleInputChange("currencySymbol")({
                    target: { value: selected.value },
                  })
                }
                options={currencyOptions}
                classNamePrefix="react-select"
                placeholder="Select Currency Type"
                styles={{
                  placeholder: (provided) => ({
                    ...provided,
                    color: "#ccc", // change to your desired color
                  }),
                }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <Select
                value={
                  formData.accountType
                    ? { label: formData.accountType, value: formData.accountType }
                    : null
                }
                onChange={(selected) =>
                  handleInputChange("accountType")({
                    target: { value: selected.value },
                  })
                }
                options={[
                  { label: "Savings Account", value: "Savings Account" },
                  { label: "Current Account", value: "Current Account" },
                ]}
                classNamePrefix="react-select"
                placeholder="Select an Account Type"
                styles={{
                  placeholder: (provided) => ({
                    ...provided,
                    color: "#ccc", // change to your desired color
                  }),
                }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Occupation"
                value={formData.occupation}
                onChange={handleInputChange("occupation")}
              />
            </div>
            <div className="col-md-6 mb-3">
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <Select
                    value={
                      countryOptions.find(
                        (option) => option.value === formData.country
                      ) || null
                    }
                  classNamePrefix="react-select"
                  options={countryOptions}
                  // onChange={handleCountryChange}
                  onChange={(selected) =>
                    handleInputChange("country")({
                      target: { value: selected.value },
                    })
                  }
                  placeholder="Select a Country"
                    styles={{
                      placeholder: (provided) => ({
                        ...provided,
                        color: "#ccc", // change to your desired color
                      }),
                    }}
                />
              )}
            </div>
          </div>
        )}

        {currentSection === 2 && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange("email")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange("phone")}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange("username")}
              />
            </div>
            <div className="col-md-6 mb-3" style={{ position: "relative" }}>
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={formData.password}
                onChange={handleInputChange("password")}
              />
              <button
                className="btn btn-sm"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                }}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                  </svg>
                ) : (
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-eye-slash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="col-md-6 mb-3">
              <input
                placeholder="Confirm Password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
              />
            </div>
          </div>
        )}

        {currentSection === 3 && (
          <>
            <div className="text-center mb-3">
              <p>Set a 4-digit Account PIN</p>
              <div className="d-flex justify-content-center gap-2 mb-2">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="border rounded px-3 py-2 fs-4"
                    style={{ minWidth: "40px" }}
                  >
                    {pin[i] || ""}
                  </span>
                ))}
              </div>
              <div className="d-grid mx-auto" style={{ maxWidth: "200px", gridTemplateColumns: "repeat(3, 1fr)", display: "grid", gap: "10px" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "←"].map((key, index) => (
                  <button
                    key={index}
                    className="btn btn-outline-primary"
                    onClick={() => {
                      if (key === "←") handleBackspace();
                      else if (typeof key === "number") handleKeypadInput(key.toString());
                    }}
                    disabled={key === ""}
                  >
                    {key}
                  </button>
                ))}
              </div>

            </div>

            <button className="btn btn-primary w-100" onClick={signup}>
              Sign Up
            </button>
          </>
        )}

        <div className="d-flex justify-content-between mt-4">
          {currentSection > 1 && (
            <button className="btn btn-secondary" onClick={prevSection}>
              Previous
            </button>
          )}
          {currentSection < 3 && (
            <button className="btn" style={{ background: "#000", color: "#fff" }} onClick={handleNext}>
              Next
            </button>
          )}
        </div>

        {/* Login redirect link */}
        <div className="text-start mt-4">
          <p>
            <Link to="/login" className="text-primary fw-bold" style={{ textDecoration: "none" }}>
              Already have an account?
            </Link>
          </p>
        </div>
      </div>

  {isLoading && <Loading />}
</div>



  );
}

export default SignUp;