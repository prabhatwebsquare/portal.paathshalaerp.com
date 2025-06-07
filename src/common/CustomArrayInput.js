import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Input, FormLabel, Box, FormErrorMessage, Flex, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";

const CustomArrayInput = ({ w, size, notRequire, type, index, name, variant, label, inputValue, setInputValue, limit, ...props }) => {
    const themeColor = getLocalStorageItem("themeColor") || "blue"
    const [labelWidth, setLabelWidth] = useState((type === "date" || type === "month") ? '60%' : "fit-content");
    const [error, setError] = useState("");

    const inputHandler = (val) => {
        if (type === "number") {
            const numericValue = val.replace(/\D/g, '');
            if (numericValue.length <= (limit || 10)) {
                setInputValue(prevState => {
                    const updatedArray = [...prevState];
                    updatedArray[index] = {
                        ...updatedArray[index],
                        [name]: val
                    };
                    return updatedArray;
                });
                setError("");
            } else {
                setError(`Input should not exceed ${limit || 10} digits.`);
            }
        }
        else {
            setInputValue(prevState => {
                const updatedArray = [...prevState];
                updatedArray[index] = {
                    ...updatedArray[index],
                    [name]: val
                };
                return updatedArray;
            });
        }
    }

    const inputRef = useRef(null)

    const labelClick = () => {
        inputRef.current.focus();
    }

    const handleFocus = () => {
        setLabelWidth('fit-content');
    };

    const handleBlur = () => {
        setLabelWidth((type === "date" || type === "month") ? '60%' : "fit-content");
    };
    return (
        <Box w={w || "100%"} key={name} position="relative">
            <Input
                ref={inputRef}
                size={size || "md"}
                className={`form-control${notRequire ? " notRequired" : ""}`}
                fontSize={14}
                fontWeight={"semibold"}
                type={type}
                isRequired={!notRequire}
                focusBorderColor={`${themeColor}.400`}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onWheel={(e) => e.target.blur()}
                value={inputValue?.[name]}
                // value={(inputValue?.[index][name] === 0 ? "0" : inputValue?.[name]) || ""}
                onChange={(e) => inputHandler(e.target.value)}
                variant={variant || "outline"}
                {...props}
            />
            <FormErrorMessage>{error}</FormErrorMessage>
            <FormLabel
                zIndex={10}
                htmlFor={name}
                position="absolute"
                left={"8px"}
                top={inputValue?.[name] ? "0" : "50%"}
                transform={"translateY(-50%)"}
                transition={"all 0.3s ease"}
                fontSize={inputValue?.[name] ? "11px" : "13px"}
                color="#373737"
                padding="2px 6px"
                borderRadius="4px"
                backgroundColor="white"
                width={labelWidth}
                onClick={labelClick}
            >
                {label}
            </FormLabel>
        </Box>
    );
};

export default CustomArrayInput;
