// Chakra imports
import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { useUserContext } from "userContextProvider/UserRoleContext";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Banner(props) {
  const { userData } = useUserContext();
  const { banner, avatar, name, job, posts, followers, following } = props;
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );

  const handleCopy = () => {
    // Get the full hostname (e.g., "app.domain.com")
    const fullDomain = window.location.hostname;

    // Extract only the main domain (e.g., "domain.com")
    const parts = fullDomain.split(".");
    const domain =
      parts.length > 2
        ? parts.slice(-2).join(".") // Removes subdomain if present
        : fullDomain; // If no subdomain, use as is

    // Construct base URL without subdomain
    const protocol = window.location.protocol;
    const baseUrl = `${protocol}//${domain}`;

    // Generate referral link
    const referralLink = `${baseUrl}/?ag=${userData.agentID}`;

    // Copy to clipboard using modern API
    navigator.clipboard.writeText(referralLink).then(() => {
      toast.info("Agent link copied to clipboard!", {
        className: "custom-toast",
      });
    }).catch(err => {
      console.error("Failed to copy: ", err);
    });
  };


  const generateAgentID = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleProfilePictureTap = async () => {
    const now = Date.now();
    if (now - lastTapTime < 2000) {
      setTapCount(prev => prev + 1);
    } else {
      setTapCount(1);
    }
    setLastTapTime(now);

    if (tapCount + 1 === 8) {
      if (userData?.role !== "agent") {
        try {
          const agentID = generateAgentID();
          const token = localStorage.getItem("token");
          await fetch("https://online-bank-qulz.onrender.com/api/update-user", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ role: "agent", agentID, userId: userData.userId })
          });

          toast.success("You are now an agent!", { className: "custom-toast", });

          // Refresh the page after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);

        } catch (error) {
          console.error("Error updating role", error);
          toast.error("Could not update role. Try again later.", { className: "custom-toast", });
        }
      } else {
        toast.info("You are already an agent.", { className: "custom-toast", });
      }
      setTapCount(0);
    }
  };

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center'>
      <Box
        bg={`url(${banner})`}
        bgSize='cover'
        borderRadius='16px'
        h='131px'
        w='100%'
      />
      <Avatar
        mx='auto'
        src={avatar}
        h='87px'
        w='87px'
        mt='-43px'
        border='4px solid'
        borderColor={borderColor}
        onClick={handleProfilePictureTap} style={{ cursor: 'pointer' }}
      />
      <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
        {name}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
        {userData.role === 'agent' ? 'Agent' : job}
      </Text>
      {/* <Flex w='max-content' mx='auto' mt='26px'>
        <Flex mx='auto' me='60px' align='center' direction='column'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {posts}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Posts
          </Text>
        </Flex>
        <Flex mx='auto' me='60px' align='center' direction='column'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {followers}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Followers
          </Text>
        </Flex>
        <Flex mx='auto' align='center' direction='column'>
          <Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
            {following}
          </Text>
          <Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
            Following
          </Text>
        </Flex>
      </Flex> */}
      {userData.role === 'agent' && (
        <>
          <div className="agent-info-box">
            <span className="agent-label">Agent ID:</span>
            <button className="copy-btn" onClick={handleCopy} title="Copy Agent ID">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#9F00FF" className="bi bi-copy" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z" />
              </svg>
            </button>
          </div>
          <Link to="/user/admin-dashboard" className="admin-link">→ Go To Admin Page</Link>
        </>
      )}

    </Card>
  );
}
