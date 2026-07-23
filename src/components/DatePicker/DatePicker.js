// DatePickerField.js
import React from "react";
import DatePicker from "react-datepicker";
import { Box, Input, useColorModeValue } from "@chakra-ui/react";

const DatePickerField = ({ selectedDate, onChange }) => {
    const bg = useColorModeValue("white", "gray.700");
    const color = useColorModeValue("black", "white");

    return (
        <Box w="100%">
            <DatePicker
                selected={selectedDate}
                onChange={onChange}
                customInput={
                    <Input
                        bg={bg}
                        color={color}
                        borderColor={useColorModeValue("gray.300", "gray.600")}
                        _hover={{ borderColor: "purple.400" }}
                        _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
                        placeholder="Select date of birth"
                    />
                }
                dateFormat="dd/MM/yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
            />
        </Box>
    );
};

export default DatePickerField;
