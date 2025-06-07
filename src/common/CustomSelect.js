import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Select, FormLabel, Box, FormControl, Text } from "@chakra-ui/react";
import { map } from "lodash";
import { useState, useRef, useEffect } from "react";

export const CustomSelect = ({
  w,
  size,
  name,
  label,
  notRequire,
  inputValue,
  setInputValue,
  data,
  style,
  mt,
  disabled
}) => {
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null);
  const hasSingleOption = data?.length === 1;

  // Add a placeholder option if only one item exists
  const options = hasSingleOption
    ? [{ name: "Select option", value: "" }, ...data]
    : data;

  // Set value automatically if only one valid item and not already set
  useEffect(() => {
    if (hasSingleOption && !inputValue?.[name]) {
      const singleOptionValue = data[0]?.value || 1;
      setInputValue((prev) => ({ ...prev, [name]: singleOptionValue }));
    }
  }, [data, hasSingleOption, inputValue, name, setInputValue]);

  const inputHandler = (val) => {
    setInputValue((prev) => ({ ...prev, [name]: val }));
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(!!inputValue?.[name]);

  return (
    <Box w={w || "100%"} position="relative" mt={mt || 0.2}>
      <FormControl isRequired={!notRequire}>
        <Select
          disabled={disabled}
          mt={mt || 2}
          _focus={{
            bg: `${themeColor}.50`,
            borderColor: `${themeColor}.900`,
            boxShadow: `0 0 0 2px ${themeColor}.900`,
          }}
          bg={inputValue?.[name] ? `gray.200` : "white"}
          w={"100%" || w}
          borderRadius="md"
          variant="outline"
          size={size || "md"}
          isRequired={!notRequire}
          borderColor={`${themeColor}.200`}
          fontSize={13}
          fontWeight={"bold"}
          focusBorderColor={`${themeColor}.400`}
          color={"blue.800"}
          placeholder="Select option"
          value={inputValue?.[name] || ""}
          onChange={(e) => inputHandler(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={selectRef}
          style={style}
        >
          {map(options, (d, index) => (
            <option
              key={index}
              style={{ fontWeight: "700", fontSize: "14px" }}
              value={d?.value}
              disabled={d.value === ""}
            >
              {d?.name}
              {d?.discount ? ` (${d.discount}%)` : ""}
            </option>
          ))}
        </Select>

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