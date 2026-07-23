import React from "react";
import Select from "react-select";
import { Box, useColorModeValue } from "@chakra-ui/react";

const CustomSelect = ({ placeholder, value, options, onChange }) => {
    const selected = options.find((opt) => opt.value === value) || null;

    // Color values based on theme
    const bgColor = useColorModeValue("#fff", "#2D3748");
    const textColor = useColorModeValue("#1A202C", "#E2E8F0");
    const borderColor = useColorModeValue("#CBD5E0", "#4A5568");
    const placeholderColor = useColorModeValue("#A0AEC0", "#A0AEC0");

    return (
        <Box>
            <Select
                placeholder={placeholder}
                options={options}
                value={selected}
                onChange={(selectedOption) =>
                    onChange({ target: { value: selectedOption?.value || "" } })
                }
                styles={{
                    control: (base, state) => ({
                        ...base,
                        backgroundColor: bgColor,
                        color: textColor,
                        borderColor: borderColor,
                        borderRadius: "8px",
                        boxShadow: state.isFocused ? `0 0 0 1px #805AD5` : "none",
                        "&:hover": {
                            borderColor: "#805AD5",
                        },
                        zIndex: 1, // control itself zIndex (usually not necessary)
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: textColor,
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: placeholderColor,
                    }),
                    menu: (base) => ({
                        ...base,
                        backgroundColor: bgColor,
                        color: textColor,
                        zIndex: 9999,  // <-- Make dropdown overlay everything else
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected
                            ? "#805AD5"
                            : isFocused
                                ? "#4A5568"
                                : "transparent",
                        color: isSelected ? "#fff" : textColor,
                        cursor: "pointer",
                    }),
                }}
            />
        </Box>
    );
};

export default CustomSelect;
