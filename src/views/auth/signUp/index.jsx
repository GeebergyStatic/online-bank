/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useRef, useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useSearchParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import CustomSelect from "../../../components/Select/CustomSelect";
import "react-datepicker/dist/react-datepicker.css";
import validator from "validator";
import { getStorage, ref as Ref, getDownloadURL, listAll } from "firebase/storage";
import "react-toastify/dist/ReactToastify.css";
import Loading from "loadingScreen/Loading";
import Select from 'react-select';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import fetchCurrencies from "components/countryAndCurrency/fetchCurrencies";
import fetchCountries from "components/countryAndCurrency/fetchCountries";
// Chakra imports
import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useColorModeValue,
    IconButton,
    Spinner,
    SimpleGrid,
    Center,
    useBreakpointValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
import DatePickerField from "components/DatePicker/DatePicker";
// Assets
import illustration from "assets/img/auth/auth.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

function SignUp() {
    // Chakra color mode
    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
    const textColorBrand = useColorModeValue("brand.500", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
    const googleText = useColorModeValue("navy.700", "white");
    const googleHover = useColorModeValue(
        { bg: "gray.200" },
        { bg: "whiteAlpha.300" }
    );
    const googleActive = useColorModeValue(
        { bg: "secondaryGray.300" },
        { bg: "whiteAlpha.200" }
    );
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

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
    const history = useNavigate();

    const [currentSection, setCurrentSection] = useState(1);
    const [pin, setPin] = useState("");
    const columns = useBreakpointValue({ base: 1, md: 2 });
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
        dateOfBirth: "",
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
            const { email, phone, username, password, confirmPassword, dateOfBirth } = formData;
            if (
                !email || !phone || !username ||
                !password || !confirmPassword ||
                !dateOfBirth || isNaN(new Date(dateOfBirth).getTime())
            ) {
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

    const isSignupValid = ({ firstName, lastName, email, password, confirmPassword, country, pin }) => {
        if (validator.isEmpty(firstName) || validator.isEmpty(lastName)) {
            toast.warning("Please input your full name", {
                position: "top-center",
                className: "custom-toast",
            });
            return false;
        }

        if (!validator.isEmail(email)) {
            toast.warning("Please input a valid email", {
                position: "top-center",
                className: "custom-toast",
            });
            return false;
        }

        if (validator.isEmpty(country)) {
            toast.warning("Please select country", {
                position: "top-center",
                className: "custom-toast",
            });
            return false;
        }

        if (validator.isEmpty(password) || !validator.isLength(password, { min: 6 })) {
            toast.warning("Your password must have at least 6 characters", {
                position: "top-center",
                className: "custom-toast",
            });
            return false;
        }

        if (validator.isEmpty(confirmPassword)) {
            toast.warning("Please input your confirm password", {
                position: "top-center",
                className: "custom-toast",
            });
            return false;
        }

        if (password !== confirmPassword) {
            toast.warning("Passwords don't match", {
                position: "top-center",
                className: "custom-toast",
            });
            return false;
        }

        if (!/^\d{4}$/.test(pin)) {
            toast.warning("PIN must be exactly 4 digits", {
                position: "top-center",
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
        return await fetchAPI('https://online-bank-qulz.onrender.com/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payLoad),
        });
    };


    const checkAgentCode = async (agentCode) => {
        const data = await fetchAPI(`https://online-bank-qulz.onrender.com/api/checkAgentCode/${agentCode}`);
        return data;
    };


    // Helper function to handle user creation
    const handleUserCreation = async (payLoad) => {
        try {
            await createUserInBackend(payLoad);
            localStorage.setItem('new', true);
            toast.success(`${payLoad.email} was created successfully! Please sign in with your created account`, {
                position: "top-center",
                className: "custom-toast",
            });
            setIsLoading(false);

            // Give toast time to display before redirect
            setTimeout(() => {
                history("/auth/sign-in");
            }, 2000); // 2 seconds is usually enough
        } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        }
    };





    // Main signup function
    // Main signup function
    const signup = async () => {
        // Trim all string fields in formData
        const trimmedData = Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
                key,
                typeof value === 'string' ? value.trim() : value
            ])
        );

        const sanitizedData = {
            ...trimmedData,
            dateOfBirth: trimmedData.dateOfBirth
                ? new Date(trimmedData.dateOfBirth).toISOString()
                : '',
            pin,
        };

        if (!isSignupValid(sanitizedData)) return;

        setIsLoading(true);

        try {
            let agentCodeData = null;
            if (agentCode) {
                agentCodeData = await checkAgentCode(agentCode);
                if (agentCodeData.status === 'false') {
                    throw new Error(agentCodeData.message || 'Invalid Agent Code');
                }
            }

            const payLoad = {
                avatar: selectedAvatar,
                email: sanitizedData.email,
                role: 'client',
                agentCode: agentCode || 'none',
                country: sanitizedData.country,
                accountType: sanitizedData.accountType,
                currencySymbol: sanitizedData.currencySymbol,
                firstName: sanitizedData.firstName,
                lastName: sanitizedData.lastName,
                username: sanitizedData.username,
                phone: sanitizedData.phone,
                occupation: sanitizedData.occupation,
                dateOfBirth: sanitizedData.dateOfBirth,
                password: sanitizedData.password,
                pin,
            };

            await handleUserCreation(payLoad);
        } catch (error) {
            let message = '';

            try {
                const jsonPart = error.message.split('Message:')[1];
                const parsed = JSON.parse(jsonPart.trim());
                message = parsed.message;
            } catch (e) {
                message = error.message || 'Something went wrong';
            }

            if (message.toLowerCase().includes('email')) {
                toast.error(`Cannot create your account. The email "${sanitizedData.email}" already exists.`, {
                    position: "top-center",
                    className: "custom-toast",
                });
            } else if (message.toLowerCase().includes('username')) {
                toast.error(`Cannot create your account. The username "${sanitizedData.username}" already exists.`, {
                    position: "top-center",
                    className: "custom-toast",
                });
            } else if (!isOnline) {
                toast.error('Check your internet connection', {
                    position: "top-center",
                    className: "custom-toast",
                });
            } else {
                toast.error(message || 'Registration failed.', {
                    position: "top-center",
                    className: "custom-toast",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <DefaultAuth>
            <Flex
                maxW={{ base: "100%", md: "max-content" }}
                w="100%"
                mx={{ base: "auto", lg: "0px" }}
                me="auto"
                h="100%"
                alignItems="start"
                justifyContent="center"
                mb={{ base: "30px", md: "60px" }}
                px={{ base: "25px", md: "0px" }}
                mt={{ base: "40px", md: "14vh" }}
                flexDirection="column"
            >
                <Box w={{ base: "100%", md: "500px" }}>
                    {currentSection !== 3 && (
                        <Text fontSize="2xl" fontWeight="bold" mb={6} bgGradient="linear(to-r, purple.400, cyan.400)" bgClip="text">
                            Sign Up
                        </Text>
                    )}

                    {currentSection === 1 && (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                            <FormControl>
                                <FormLabel>First Name</FormLabel>
                                <Input placeholder="First Name" value={formData.firstName} onChange={handleInputChange("firstName")} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Last Name</FormLabel>
                                <Input placeholder="Last Name" value={formData.lastName} onChange={handleInputChange("lastName")} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Currency</FormLabel>
                                <CustomSelect
                                    placeholder="Select Currency Type"
                                    value={formData.currencySymbol}
                                    options={currencyOptions}
                                    onChange={handleInputChange("currencySymbol")}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Account Type</FormLabel>
                                <CustomSelect
                                    placeholder="Select Account Type"
                                    value={formData.accountType}
                                    options={[
                                        { label: "Savings Account", value: "Savings Account" },
                                        { label: "Current Account", value: "Current Account" },
                                    ]}
                                    onChange={handleInputChange("accountType")}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Occupation</FormLabel>
                                <Input placeholder="Occupation" value={formData.occupation} onChange={handleInputChange("occupation")} />
                            </FormControl>

                            {loading ? (
                                <Center>
                                    <Spinner />
                                </Center>
                            ) : (
                                <FormControl>
                                    <FormLabel>Country</FormLabel>
                                    <CustomSelect
                                        placeholder="Select a Country"
                                        value={formData.country}
                                        options={countryOptions}
                                        onChange={handleInputChange("country")}
                                    />
                                </FormControl>

                            )}
                        </SimpleGrid>
                    )}

                    {currentSection === 2 && (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                            <FormControl>
                                <FormLabel>Email Address</FormLabel>
                                <Input placeholder="Email Address" value={formData.email} onChange={handleInputChange("email")} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Phone Number</FormLabel>
                                <Input placeholder="Phone Number" value={formData.phone} onChange={handleInputChange("phone")} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Username</FormLabel>
                                <Input placeholder="Username" value={formData.username} onChange={handleInputChange("username")} />
                            </FormControl>

                            <FormControl id="dateOfBirth">
                                <FormLabel>Date of Birth</FormLabel>
                                <DatePickerField selectedDate={formData.dateOfBirth}
                                    onChange={(date) =>
                                        handleInputChange("dateOfBirth")({ target: { value: date } })
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange("password")}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            size="sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Confirm Password</FormLabel>
                                <Input
                                    placeholder="Confirm Password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange("confirmPassword")}
                                />
                            </FormControl>
                        </SimpleGrid>

                    )}

                    {currentSection === 3 && (
                        <>
                            <Text fontWeight="bold" textAlign="center" mb={2}>
                                Set a 4-digit Account PIN
                            </Text>
                            <Flex justify="center" gap={2} mb={4}>
                                {[...Array(4)].map((_, i) => (
                                    <Box key={i} px={3} py={2} border="1px solid" borderColor="gray.400" borderRadius="md" fontSize="2xl">
                                        {pin[i] || ""}
                                    </Box>
                                ))}
                            </Flex>
                            <SimpleGrid columns={3} spacing={3} maxW="200px" mx="auto" mb={4}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "←"].map((key, i) => (
                                    <Button
                                        key={i}
                                        onClick={() =>
                                            key === "←" ? handleBackspace() : typeof key === "number" ? handleKeypadInput(String(key)) : null
                                        }
                                        isDisabled={key === ""}
                                    >
                                        {key}
                                    </Button>
                                ))}
                            </SimpleGrid>
                            <Button colorScheme="purple" w="60%" mx="auto" display="block" onClick={signup}>
                                Sign Up
                            </Button>
                        </>
                    )}

                    <Flex justify="space-between" mt={6}>
                        {currentSection > 1 && (
                            <Button variant="outline" onClick={prevSection}>
                                Previous
                            </Button>
                        )}
                        {currentSection < 3 && (
                            <Button bg="black" color="white" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Flex>

                    <Text mt={6}>
                        Already have an account?{" "}
                        <Link to={`/auth/sign-in${location.search}${location.hash}`}>
                            <Text as="span" color="purple.500" fontWeight="bold">
                                Login
                            </Text>
                        </Link>
                    </Text>
                </Box>

                {isLoading && <Loading />}
            </Flex>
        </DefaultAuth>

    );
}

export default SignUp;
