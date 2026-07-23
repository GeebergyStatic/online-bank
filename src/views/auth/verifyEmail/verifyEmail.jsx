import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Heading, Text, Spinner, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("verifying");

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await fetch(`https://online-bank-qulz.onrender.com/api//verify-email?token=${token}`);
                const data = await res.json();
                if (res.ok && data.status === "success") setStatus("success");
                else setStatus("error");
            } catch {
                setStatus("error");
            }
        };
        if (token) verify();
        else setStatus("error");
    }, [token]);

    return (
        <Box textAlign="center" mt="100px">
            {status === "verifying" && <Spinner size="xl" color="purple.500" />}
            {status === "success" && (
                <>
                    <Heading color="purple.600">Email Verified</Heading>
                    <Text mt={4}>Your email has been successfully verified. You can now log in to your account.</Text>
                    <Link to="/auth/sign-in"><Button mt={6} colorScheme="purple">Go to Login</Button></Link>
                </>
            )}
            {status === "error" && (
                <>
                    <Heading color="red.600">Verification Failed</Heading>
                    <Text mt={4}>The link is invalid, expired, or already used.</Text>
                </>
            )}
        </Box>
    );
}
