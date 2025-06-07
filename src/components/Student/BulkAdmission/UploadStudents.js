import React, { useRef, useState } from "react";
import { Button, Input } from "@chakra-ui/react";
import * as XLSX from "xlsx";

const ExcelDataUpload = ({ disabled, themeColor, setExcelData }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const toggleUpload = () => {
    inputRef.current.click();
  };

  const handleFileUpload = (event) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
          const headers = jsonData[0];
          const headerLength = headers.length;
      
          const dateColumns = ['DOB', 'Admission Date']; // Columns you want to parse as dates
      
          const formattedData = jsonData.map((row, rowIndex) => {
            if (Array.isArray(row)) {
              if (rowIndex !== 0) {
                while (row.length < headerLength) {
                  row.push(null);
                }
              }
              return row.map((cell, colIndex) => {
                const headerName = headers[colIndex];
      
                if (dateColumns.includes(headerName) && typeof cell === 'number') {
                  const date = XLSX.SSF.parse_date_code(cell);
                  if (date) {
                    const jsDate = new Date(date.y, date.m - 1, date.d);
                    if (jsDate.getFullYear() >= 1900 && jsDate.getFullYear() <= 2100) {
                      return jsDate.toISOString().split('T')[0]; // format YYYY-MM-DD
                    }
                  }
                }
                // For other columns, keep as is
                return cell === undefined || cell === null ? null : cell;
              });
            } else {
              console.error("Row is not an array:", row);
              return [];
            }
          });
      
          setExcelData(formattedData);
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        } finally {
          setInputValue("");
        }
      };
      
      
      
  
      reader.readAsArrayBuffer(file);
    }
  };
  

  return (
    <>
      <Button
        size={"sm"}
        isDisabled={disabled}
        colorScheme={themeColor}
        onClick={toggleUpload}
      >
        Upload Students
      </Button>
      <Input
        ref={inputRef}
        display={"none"}
        type="file"
        value={inputValue}
        onChange={handleFileUpload}
        accept=".xlsx, .xls"
      />
    </>
  );
};

export default ExcelDataUpload;
