import { getLocalStorageItem } from '@/utils/LocalStorage';
import { Box, FormLabel, Text, Textarea, FormControl, Text as ChakraText } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

const CustomTextarea = ({ 
    w, notRequire, size, name, label, rows, inputValue, setInputValue, ...props 
}) => {
    const themeColor = getLocalStorageItem("themeColor") || "blue";
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const maxChars = 150;

    const inputHandler = (val) => {
        if (val.length <= maxChars) {
            setInputValue(prev => ({ ...prev, [name]: val }));
        }
    };

    const labelClick = () => {
        inputRef.current.focus();
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(inputValue?.[name] ? true : false);
    
    const charCount = inputValue?.[name]?.length || 0;

    return (
        <Box w={w || "100%"} key={name} position="relative" mt={4}>
            <FormControl isRequired={!notRequire}>
                <Textarea
                    ref={inputRef}
                    {...props}
                    size={size || "md"}
                    fontSize={14}
                    fontWeight="bold"
                    color="blue.800"
                    rows={rows || 3}
                    borderColor={`${themeColor}.200`}
                    focusBorderColor={`${themeColor}.400`}
                    _focus={{
                        bg: `${themeColor}.50`, 
                        borderColor: `${themeColor}.900`,
                        boxShadow: `0 0 0 2px ${themeColor}.900`,
                    }}
                    bg={inputValue?.[name] ? "gray.200" : "white"}
                    value={inputValue?.[name] || ""}
                    onChange={(e) => inputHandler(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <FormLabel
                    htmlFor={name}
                    position="absolute"
                    top={isFocused || inputValue?.[name] ? "-8.5px" : "50%"}
                    left="12px"
                    transform="translateY(-50%)"
                    fontSize={isFocused || inputValue?.[name] ? "xs" : "sm"}
                    fontWeight="medium"
                    color={isFocused ? `${themeColor}.400` : "gray.600"}
                    transition="all 0.2s ease"
                    backgroundColor="white"
                    px="2"
                    onClick={labelClick}
                >
                    {label} {!notRequire && <ChakraText as="span" ml={1} color="red">*</ChakraText>}
                </FormLabel>
            </FormControl>
            <ChakraText fontSize="12px" color="gray.500" mt={1}>
                {charCount}/{maxChars} characters
            </ChakraText>
        </Box>
    );
};

export default CustomTextarea;
