// import React, { useRef } from 'react';
// import { Button, Input } from '@chakra-ui/react';
// import * as XLSX from 'xlsx';

// const ExcelDataUpload = ({ disabled, setExcelData }) => {

//     const inputRef = useRef(null);

//     const toggleUpload = () => {
//         inputRef.current.click()
//     }
//     const handleFileUpload = (event) => {
//         if (event.target.files?.length) {
//             const file = event.target.files[0];
//             const reader = new FileReader();

//             reader.onload = (e) => {
//                 try {
//                     const data = new Uint8Array(e.target.result);
//                     const workbook = XLSX.read(data, { type: 'array' });
//                     const sheetName = workbook.SheetNames[0];
//                     const sheet = workbook.Sheets[sheetName];
//                     const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//                     setExcelData(jsonData);
//                 } catch (error) {
//                     console.error('Error parsing Excel file:', error);
//                 }
//             };

//             reader.readAsArrayBuffer(file);
//         }
//     };

//     return (
//         <>
//             <Button size={"sm"} colorScheme={"green"} isDisabled={disabled} onClick={toggleUpload}>Upload Result</Button>
//             <Input ref={inputRef} display={"none"} type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
//         </>
//     );
// };

// export default ExcelDataUpload;

import React, { useRef, useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import * as XLSX from 'xlsx';

const ExcelDataUpload = ({ disabled, setExcelData }) => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState("")

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
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    setExcelData(jsonData);
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                } finally {
                    setInputValue('')
                }
            };

            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <>
            <Button size={"sm"} colorScheme={"green"} isDisabled={disabled} onClick={toggleUpload}>Upload Result</Button>
            <Input ref={inputRef} display={"none"} type="file" value={inputValue} onChange={handleFileUpload} accept=".xlsx, .xls" />
        </>
    );
};

export default ExcelDataUpload;
