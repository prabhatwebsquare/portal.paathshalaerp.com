import { getLocalStorageItem } from "@/utils/LocalStorage";
import { Box, FormLabel, FormControl } from "@chakra-ui/react";
import { find, map } from "lodash";
import { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export const MultiSelectDropdown = ({
  name,
  label,
  value,
  selected,
  options,
  w,
  notRequire,
}) => {
  const themeColor = getLocalStorageItem("themeColor") || "blue";
  const [selectedOptions, setSelectedOptions] = useState(
    map(value, (v) => find(options, (o) => o.value === v)) || []
  );

  useEffect(() => {
    if (!value?.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(map(value, (v) => find(options, (o) => o.value === v)));
    }
  }, [value, options]);

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    selected(name, map(selectedOptions, "value"));
  };

  return (
    <Box w={w || "100%"} position="relative" mt={1}>
      <FormControl isRequired={!notRequire}>
        <Select
          placeholder={label}
          closeMenuOnSelect={false}
          components={animatedComponents}
          value={selectedOptions}
          onChange={handleChange}
          isMulti
          options={options}
          classNamePrefix="select"
          styles={{
            control: (base, { isFocused }) => ({
              ...base,
              backgroundColor: selectedOptions.length ? "gray.200" : "white",
              borderColor: isFocused ? `${themeColor}.900` : `${themeColor}.200`,
              boxShadow: isFocused ? `0 0 0 2px ${themeColor}.900` : "none",
              "&:hover": {
                borderColor: `${themeColor}.400`,
              },
              "&:focus": {
                backgroundColor: `${themeColor}.50`,
                borderColor: `${themeColor}.900`,
                boxShadow: `0 0 0 2px ${themeColor}.900`,
              },
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        />
        <FormLabel
          htmlFor={name}
          position="absolute"
          top={selectedOptions.length ? "-8.5px" : "50%"}
          left="12px"
          transform="translateY(-50%)"
          fontSize={selectedOptions.length ? "xs" : "sm"}
          fontWeight="medium"
          color={selectedOptions.length ? `${themeColor}.400` : "gray.600"}
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
