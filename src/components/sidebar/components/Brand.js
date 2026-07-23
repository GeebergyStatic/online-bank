import React from "react";

// Chakra imports
import { Flex, useColorModeValue, Text, Box, Image } from "@chakra-ui/react";

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align="center" direction="column" py="6" px="4" bg="transparent">
      <Flex align="center" justify="center" mb="3">
        <Image
          src="/bank-logo.png" // Ensure this path is correct
          alt="TrustLine Logo"
          height="auto"
          width="60px"
          maxHeight="60px"
          objectFit="contain"
          mr="2"
        />

        <Box>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="purple.600"
            lineHeight="1"
          >
            TrustLine
          </Text>
          <Text fontSize="sm" color="gray.500" mt="1">
            Digital Bank
          </Text>
        </Box>
      </Flex>
      <HSeparator mb="20px" />
    </Flex>


  );
}

export default SidebarBrand;
