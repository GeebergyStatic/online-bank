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
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Button,
  Input,
  Flex,
  FormControl,
  FormLabel,
  Spinner
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from 'react';
import { useUserContext } from 'userContextProvider/UserRoleContext';
import getSymbolFromCurrency from 'currency-symbol-map';
import './Transactions.css'


export default function Transactions() {
  const { userData } = useUserContext();
  const [transactionsData, setTransactionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userData?.userId) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://online-bank-qulz.onrender.com/api/getUserTransactions?userID=${userData.userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch transactions");
        }

        // Fully format each transaction
        const formatted = data.map((tx, index) => ({
          id: tx._id || index + 1,
          amount:
            tx.transactionType?.toLowerCase() === "deposit"
              ? parseFloat(tx.amount)
              : -Math.abs(parseFloat(tx.amount)),

          transactionType: tx.transactionType || "N/A",
          sender: tx.accountName || tx.email || tx.walletName || null,
          receiver: tx.walletAddress || tx.bankName || tx.swiftCode || tx.senderOrReceiver || null,
          description: tx.description || "N/A",
          date: tx.timestamp, // raw Date object/string
          status: tx.status || "pending",
        }));

        setTransactionsData(formatted);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [userData]);



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

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString();

  const printRef = useRef(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = transactionsData
    .filter((tx) => {
      const txDate = new Date(tx.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!start || txDate >= start) && (!end || txDate <= end);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort from latest to oldest


  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore React state
  };

  // Chakra Color Mode
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {isLoading ? (
        <div style={{ padding: "10px", textAlign: "center" }}>
          <Spinner animation="border" size="md" />
        </div>
      ) : (
        <Box px={4}>

          {/* Filter Section with Labels */}
          <Flex gap={6} mb={6} flexWrap="wrap">
            <FormControl w="200px">
              <FormLabel fontWeight="semibold">From</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />
            </FormControl>
            <FormControl w="200px">
              <FormLabel fontWeight="semibold">To</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
            </FormControl>
          </Flex>

          {/* Transactions Table */}
          <Box ref={printRef} overflowX="auto">
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>S/N</Th>
                  <Th>Amount</Th>
                  <Th>Type</Th>
                  <Th>Sender/Receiver</Th>
                  <Th>Description</Th>
                  <Th>Created At</Th>
                  <Th>Time Created</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((tx, index) => (
                  <Tr key={tx.id}>
                    <Td>{index + 1}</Td>
                    <Td
                      color={
                        tx.transactionType?.toLowerCase() === "deposit" ||
                          tx.transactionType?.toLowerCase() === "loan"
                          ? "green.500"
                          : "red.500"
                      }
                    >
                      {formatCurrency(tx.amount, userData.currencySymbol)}
                    </Td>

                    <Td>{tx.transactionType || "N/A"}</Td>
                    <Td>{tx.sender || tx.receiver || "N/A"}</Td>
                    <Td>{tx.description}</Td>
                    <Td>{formatDate(tx.date)}</Td>
                    <Td>{formatTime(tx.date)}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          tx.status?.toLowerCase() === "completed" || tx.status?.toLowerCase() === "success"
                            ? "green"
                            : tx.status?.toLowerCase() === "pending"
                              ? "yellow"
                              : "red"
                        }
                      >
                        {tx.status || "Unknown"}
                      </Badge>

                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {/* Print Button */}
          <Button
            mt={6}
            colorScheme="blue"
            onClick={handlePrint}
            isDisabled={filteredTransactions.length === 0}
          >
            Print Statement
          </Button>
        </Box>
      )}

    </Box>
  );
}
