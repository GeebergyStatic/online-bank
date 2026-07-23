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

// Chakra imports
import { Box, Grid } from "@chakra-ui/react";
import { useUserContext } from "userContextProvider/UserRoleContext";

// Custom components
import Banner from "views/user/profile/components/Banner";
import General from "views/user/profile/components/General";
import Notifications from "views/user/profile/components/Notifications";
import Projects from "views/user/profile/components/Projects";
import Storage from "views/user/profile/components/Storage";
import Upload from "views/user/profile/components/Upload";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React from "react";

export default function Overview() {
  const { userData } = useUserContext();
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Grid
        mb="20px"
        templateColumns={{ base: "1fr", lg: "1.5fr 2.5fr" }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Banner
          banner={banner}
          avatar={userData?.avatar}
          name={`${userData?.firstName} ${userData?.lastName}`}
          job={userData?.occupation}
        // posts="17"
        // followers="9.7k"
        // following="274"
        />

        <General
          minH="365px"
          pe="20px"
        />
      </Grid>


    </Box>
  );
}
