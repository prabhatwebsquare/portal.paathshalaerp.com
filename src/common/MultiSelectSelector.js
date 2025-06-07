import React from "react";
import { Box } from "@chakra-ui/react";
import Select, { components } from "react-select";

// Custom styles for the select component
const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "2.5rem",
    maxHeight: "2.5rem",
    width: "300px",
    borderRadius: "8px",
    borderColor: "#E2E8F0",
    boxShadow: "none",
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap", // Prevent wrapping to keep items in a single line
    overflow: "hidden",
    "&:hover": {
      borderColor: "#3182ce",
    },
  }),
  container: (provided) => ({
    ...provided,
    width: "300px",
    maxHeight: "2.5rem",
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap", // Ensure items stay in a single line
    overflow: "hidden",
    padding: "2px 8px",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#EDF2F7",
    borderRadius: "8px",
    maxWidth: "90px", // Slightly reduced to ensure space for remove button
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    margin: "2px", // Consistent spacing
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#2D3748",
    fontWeight: "500",
    fontSize: "0.875rem",
    padding: "2px 4px",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#3182ce",
    padding: "0 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundColor: "#E2E8F0",
      color: "#C53030",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#3182ce",
    padding: "0 8px",
    "&:hover": {
      color: "#2B6CB0",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
    padding: "8px 0",
    width: "300px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#3182ce" : "transparent",
    color: state.isSelected ? "#ffffff" : "#2D3748",
    padding: "8px 12px",
    "&:hover": {
      backgroundColor: "#EDF2F7",
    },
    pointerEvents: state.isDisabled ? "none" : "auto",
  }),
};

// Custom MultiValue component to limit visible items
const MultiValue = (props) => {
  const maxVisibleItems = 2; // Show only 2 items
  const index = props.index;
  const totalSelected = props.selectProps.value.length;

  if (index < maxVisibleItems) {
    return <components.MultiValue {...props} />;
  }

  if (index === maxVisibleItems) {
    const hiddenCount = totalSelected - maxVisibleItems;
    return (
      <Box
        bg="#EDF2F7"
        borderRadius="8px"
        px={2}
        py={1}
        fontSize="0.875rem"
        color="#2D3748"
        fontWeight="500"
        display="flex"
        alignItems="center"
      >
        +{hiddenCount} more
      </Box>
    );
  }

  return null; // Hide additional items
};

const MultiSelectSelector = ({ label, name, options, selectedValues, setSelectedValues }) => {
  // Handle select change
  const handleChange = (selectedOptions) => {
    if (!selectedOptions) {
      setSelectedValues([]);
      return;
    }

    // Extract selected values
    const selectedIds = selectedOptions.map((opt) => opt.value);

    // If "Select All" is selected, select everything
    if (selectedIds?.includes("all")) {
      setSelectedValues(options.map((opt) => opt.value));
    } else {
      setSelectedValues(selectedIds);
    }
  };

  // Check if all options are selected
  const isAllSelected = selectedValues?.length === options?.length;

  // Modify options to include "Select All"
  const modifiedOptions = [
    { value: "all", name: "Select All", isDisabled: isAllSelected },
    ...(options || []),
  ];

  return (
    <Box width="300px" p={0} borderRadius="8px">
      <Select
        isMulti
        name={name}
        options={modifiedOptions}
        value={modifiedOptions.filter((opt) => selectedValues?.includes(opt.value))}
        onChange={handleChange}
        getOptionLabel={(e) => e.name}
        getOptionValue={(e) => e.value}
        placeholder={label}
        styles={customStyles}
        components={{ MultiValue }} // Use custom MultiValue component
      />
    </Box>
  );
};

export default MultiSelectSelector;