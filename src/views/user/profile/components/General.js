// Chakra imports
import { SimpleGrid, Text, useColorModeValue, Flex, Icon, Link } from "@chakra-ui/react";
import { FaCheckCircle } from 'react-icons/fa';
import { MdWarningAmber } from 'react-icons/md'; // caution/warning icon
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import { useUserContext } from "userContextProvider/UserRoleContext";
import Information from "views/user/profile/components/Information";

// Assets
export default function GeneralInformation(props) {
  const { userData } = useUserContext();
  const isAccountActive = userData?.isUserActive; // or false
  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        General Information
      </Text>
      <Flex align="center" mb="40px">
        <Icon
          as={isAccountActive ? FaCheckCircle : MdWarningAmber}
          color={isAccountActive ? 'green.500' : 'yellow.500'}
          boxSize={5}
          mr={3}
        />
        <Text
          color={isAccountActive ? 'green.600' : 'yellow.700'}
          fontSize="md"
          fontWeight="medium"
        >
          {isAccountActive ? (
            'Your account is active.'
          ) : (
            <>
              Your account is inactive. Please contact your account manager via live chat or{' '}
              <Link
                href="mailto:trustline@chainaccess.org"
                color="blue.500"
                textDecoration="underline"
              >
                support
              </Link>
              .
            </>
          )}
        </Text>
      </Flex>
      <SimpleGrid columns='2' gap='20px'>
        <Information
          boxShadow={cardShadow}
          title='Account NUmber'
          value={userData?.accountNumber}
        />
        <Information
          boxShadow={cardShadow}
          title='Account Type'
          value={userData?.accountType}
        />
        <Information
          boxShadow={cardShadow}
          title='Country'
          value={userData?.country}
        />
        <Information
          boxShadow={cardShadow}
          title='Currency'
          value={userData?.currencySymbol}
        />
        <Information
          boxShadow={cardShadow}
          title='Phone No.'
          value={userData?.phoneNo}
        />
        <Information
          boxShadow={cardShadow}
          title='Date Of Birth'
          value={
            userData?.dateOfBirth
              ? new Date(userData.dateOfBirth).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              : ''
          }

        />
      </SimpleGrid>
    </Card>
  );
}
