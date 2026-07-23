// Chakra imports
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";
import Footer from "components/footer/FooterAuth";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// Custom components
import { NavLink } from "react-router-dom";
// Assets
import { FaChevronLeft } from "react-icons/fa";

function AuthIllustration(props) {
  const { children, illustrationBackground } = props;
  // Chakra color mode
  return (
    <Flex position='relative' h='max-content'>
      <Flex
        h={{
          sm: "initial",
          md: "unset",
          lg: "100vh",
          xl: "97vh",
        }}
        w='100%'
        maxW={{ base: "100%", md: "90%", lg: "66%", xl: "1313px" }}
        mx='auto'
        pt={{ sm: "50px", md: "0px" }}
        px={{ lg: "30px", xl: "0px" }}
        ps={{ xl: "70px" }}
        justifyContent='start'
        direction='column'>

        {children}
        <Box
          display={{ base: "none", lg: "block" }} // Now only shows from large screens and up
          h='100%'
          minH='100vh'
          w={{ lg: "40vw", xl: "44vw", "2xl": "44vw" }}
          position='absolute'
          right='0px'
        >
          <DotLottieReact
            src="https://lottie.host/fb04dca2-3ddb-45cd-bead-832bcd7be7df/5eN3hmlNOp.lottie"
            speed="1"
            autoplay
          />
        </Box>

        <Footer />
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}
// PROPS

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
