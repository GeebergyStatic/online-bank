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
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import { useUserContext } from "userContextProvider/UserRoleContext";
import CheckTable from "views/user/default/components/CheckTable";
import ComplexTable from "views/user/default/components/ComplexTable";
import DailyTraffic from "views/user/default/components/DailyTraffic";
import PieCard from "views/user/default/components/PieCard";
import Tasks from "views/user/default/components/Tasks";
import TotalSpent from "views/user/default/components/TotalSpent";
import WeeklyRevenue from "views/user/default/components/WeeklyRevenue";
import DepositList from "components/adminComponents/ApproveDeposit";
import WithdrawList from "components/adminComponents/ApproveWithdraws";
import LoansList from "components/adminComponents/ApproveLoans";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/user/default/variables/columnsData";
import tableDataCheck from "views/user/default/variables/tableDataCheck.json";
import tableDataComplex from "views/user/default/variables/tableDataComplex.json";
import getSymbolFromCurrency from 'currency-symbol-map';
import { resolveFlagUrl } from "components/countryAndCurrency/resolveFlag";

export default function UserReports() {
  const { userData } = useUserContext();
  const userId = userData?.userId;
  const [activeTab, setActiveTab] = useState('deposit');
  const [flagUrl, setFlagUrl] = useState(null);
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  function formatCurrency(amount, currencyCode = 'USD', locale = 'en-US') {
    if (amount === null || amount === undefined) amount = 0;

    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      // fallback if currency code is invalid
      const symbol = getSymbolFromCurrency(currencyCode) || '';
      return `${symbol}${Number(amount).toLocaleString(locale, { minimumFractionDigits: 2 })}`;
    }
  }


  useEffect(() => {
    if (!userData?.country) return;

    resolveFlagUrl(userData.country).then(setFlagUrl);
  }, [userData?.country]);


  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {userData.role === 'agent' ? (
        <>
          {/* Toggle Buttons */}
          <div className="tab-toggle-container">
            <button
              className={`custom-tab-btn ${activeTab === 'deposit' ? 'active' : ''}`}
              onClick={() => setActiveTab('deposit')}
            >
              Deposits
            </button>
            <button
              className={`custom-tab-btn ${activeTab === 'withdraw' ? 'active' : ''}`}
              onClick={() => setActiveTab('withdraw')}
            >
              Withdrawals
            </button>
            <button
              className={`custom-tab-btn ${activeTab === 'submitted' ? 'active' : ''}`}
              onClick={() => setActiveTab('submitted')}
            >
              Loans
            </button>
          </div>



          {/* Content based on selected tab */}
          <div>
            {activeTab === 'deposit' && (
              <div>
                <DepositList />
              </div>
            )}
            {activeTab === 'withdraw' && (
              <div>
                <WithdrawList />
              </div>
            )}
            {activeTab === 'submitted' && (
              <div>
                <LoansList />
              </div>
            )}
          </div>
        </>
      ) :
        (

          <>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
              gap='20px'
              mb='20px'>
              <MiniStatistics
                startContent={
                  <IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={
                      <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
                    }
                  />
                }
                name='Earnings'
                value={
                  userData?.earnings !== undefined
                    ? formatCurrency(userData.earnings, userData.currencySymbol)
                    : "$0.00"
                }
              />
              <MiniStatistics
                startContent={
                  <IconBox
                    w='56px'
                    h='56px'
                    bg={boxBg}
                    icon={
                      <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
                    }
                  />
                }
                name='Spend this month'
                value={
                  userData?.monthlySpent !== undefined
                    ? formatCurrency(userData.monthlySpent, userData.currencySymbol)
                    : "$0.00"
                }
              />
              <MiniStatistics
                endContent={
                  <Flex me='-16px' mt='10px'>
                    <FormLabel htmlFor='balance'>
                      <Avatar
                        src={flagUrl}
                        size="md"        // increase: xs < sm < md < lg < xl
                        bg="transparent"
                        sx={{
                          img: {
                            objectFit: "contain",
                            width: "90%", // increase the flag inside the circle
                            height: "90%",
                          },
                        }}
                      />

                    </FormLabel>
                  </Flex>
                }
                name='Your balance'
                value={
                  userData?.balance !== undefined
                    ? formatCurrency(userData.balance, userData.currencySymbol)
                    : "$0.00"
                }
              />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
              <TotalSpent />
              <WeeklyRevenue />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
              <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
                <MiniCalendar h='100%' minW='100%' selectRange={false} />
              </SimpleGrid>
            </SimpleGrid>
          </>
        )}

    </Box>
  );
}
