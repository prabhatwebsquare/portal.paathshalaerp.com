import { getLocalStorageItem, setLocalStorageItem } from "@/utils/LocalStorage";
import { CheckIcon, CloseIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Input,
  FormLabel,
  Box,
  FormErrorMessage,
  Text,
  Flex,
  FormControl,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useRef, useState } from "react";

const CustomInput = ({
  w,
  size,
  withCheck,
  isPassword,
  change,
  validate,
  notRequire,
  type,
  fees,
  search,
  name,
  variant,
  label,
  inputValue,
  setInputValue,
  limit,
  max,
  min, // Add min and max as props
  isBorderColor,
  ...props
}) => {
  const [labelWidth, setLabelWidth] = useState(
    type === "date" || type === "month" ? "60%" : "fit-content"
  );
  const [error, setError] = useState("");
  const themeColor = getLocalStorageItem("themeColor") || "blue";

  const isValidDate = (dateString) => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regEx)) return false; // Invalid format
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return false; // Invalid date
    return d.toISOString().slice(0, 10) === dateString;
  };

  const inputHandler = (val) => {
    if (search === true) {
      if (type === "number") {
        const numericValue = val.replace(/\D/g, "");
        if (numericValue.length <= (limit || 10)) {
          setInputValue(numericValue);
          setError("");
        }
      } else {
        setInputValue(val);
      }
    } else if (fees === true) {
      setInputValue(name, val);
    } else {
      if (type === "number") {
        const numericValue = val.replace(/\D/g, "");
        if (numericValue.length <= (limit || 10)) {
          setInputValue((pre) => ({ ...pre, [name]: numericValue }));
          setError("");
        } else {
          setError("Input should not exceed 10 digits.");
        }
      } else if (type === "date") {
        if (isValidDate(val)) {
          setInputValue((pre) => ({ ...pre, [name]: val }));
          setError("");
        } else {
          setError("Invalid date format.");
        }
      } else {
        if (name === "fees_name_master") {
          return {
            ...pre,
            [name]: { ...pre[name.name], name: val }, // Update nested field
          };
        }
        setInputValue((pre) => ({ ...pre, [name]: val }));
      }
    }
  };

  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => {
    setLabelWidth("fit-content");
    setIsFocused(true);
  };

  const handleBlur = () => {
    setLabelWidth(type === "date" || type === "month" ? "80%" : "fit-content");
    setIsFocused(inputValue?.[name] ? true : false);
  };

  return (
    <Box w={w || "100%"} key={name} position="relative" mt={1}>
      <FormControl
        isRequired={!notRequire}
        className={`form-control${notRequire ? " notRequired" : ""}`}
      >
        <InputGroup>
          <Input
            {...props}
            _focus={{
              bg: `${themeColor}.50`, // Background color changes on focus
              borderColor: `${themeColor}.900`,
              boxShadow: `0 0 0 2px ${themeColor}.900`, // Optional: Add focus shadow
            }}
            bg={inputValue?.[name] ? `gray.200` : "white"}
            w={"100%"}
            size={size || "md"}
            fontSize={14}
            fontWeight={"bold"}
            color={
              withCheck ? (validate ? "green.500" : "red.500") : "blue.800"
            }
            max={max}
            min={min}
            type={type || "text"}
            borderColor={`${themeColor}.200`}
            focusBorderColor={`${themeColor}.400`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={inputValue?.[name] || ""}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => inputHandler(e.target.value)}
            variant={variant || "outline"}
            ref={inputRef}
          />
          {withCheck && inputValue?.[name] ? (
            <InputRightElement>
              {validate ? (
                <CheckIcon color="green.500" />
              ) : (
                <CloseIcon boxSize={3} color={"red.500"} />
              )}
            </InputRightElement>
          ) : isPassword ? (
            <InputRightElement onClick={() => change(type)}>
              {type === "text" ? (
                <ViewIcon color="green.500" />
              ) : (
                <ViewOffIcon color="green.500" />
              )}
            </InputRightElement>
          ) : null}
        </InputGroup>
        <FormErrorMessage>{error}</FormErrorMessage>
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
          pointerEvents="none"
        >
          {label}
        </FormLabel>
      </FormControl>
    </Box>
  );
};

export default CustomInput;
