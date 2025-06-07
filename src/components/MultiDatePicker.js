import React, { useState } from "react";
import { Box, Text, useTheme } from "@chakra-ui/react";
import DatePicker from "react-multi-date-picker";
import chakra from "@react-multi-date-picker/chakra-ui";

const ChakraDatePicker = chakra(DatePicker);

const MultiDatePicker = ({ themeColor = "blue" }) => {
  const [dates, setDates] = useState([]); // Manage selected dates
  const chakraTheme = useTheme();

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        Select Dates:
      </Text>
      <ChakraDatePicker
        multiple
        value={dates}
        onChange={setDates}
        calendarPosition="bottom-center"
        style={{
          border: `1px solid ${chakraTheme.colors[themeColor][500]}`,
          borderRadius: "8px",
          padding: "10px",
          color: chakraTheme.colors[themeColor][700],
        }}
        inputStyle={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: `1px solid ${chakraTheme.colors[themeColor][500]}`,
          color: chakraTheme.colors[themeColor][700],
        }}
        weekDays={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        months={[
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]}
      />
      <Box mt={4}>
        <Text fontWeight="bold">Selected Dates:</Text>
        <Box>
          {dates.length
            ? dates.map((date, index) => (
                <Text key={index} color={`${themeColor}.600`}>
                  {date.format("YYYY-MM-DD")}
                </Text>
              ))
            : "No dates selected"}
        </Box>
      </Box>
    </Box>
  );
};

export default MultiDatePicker;
