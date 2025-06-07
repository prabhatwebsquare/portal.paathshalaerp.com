// import React, { useRef, useState } from 'react';
// import { Button, Input } from '@chakra-ui/react';
// import * as XLSX from 'xlsx';

// const UploadExcel = ({ disabled, button, setExcelData }) => {
//     const inputRef = useRef(null);
//     const [inputValue, setInputValue] = useState("")

//     const toggleUpload = () => {
//         inputRef.current.click();
//     };

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
//                 } finally {
//                     setInputValue('')
//                 }
//             };
//             reader.readAsArrayBuffer(file);
//         }
//     };

//     return (
//         <>
//             <Button size={"sm"} colorScheme={"green"} isDisabled={disabled} onClick={toggleUpload}>{button || "Upload Excel"}</Button>
//             <Input ref={inputRef} display={"none"} type="file" value={inputValue} onChange={handleFileUpload} accept=".xlsx, .xls" />
//         </>
//     );
// };

// export default UploadExcel;

import React, { useRef, useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const UploadExcel = ({ disabled, button, setExcelData }) => {
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState("")

    const toggleUpload = () => {
        inputRef.current.click();
    };

    const handleFileUpload = (event) => {
        if (event.target.files?.length) {
            const file = event.target.files[0];
            const reader = new FileReader();
            const fileExtension = file.name.split('.').pop();

            reader.onload = (e) => {
                try {
                    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                        setExcelData(jsonData);
                    } else if (fileExtension === 'csv') {
                        const csvData = e.target.result;
                        Papa.parse(csvData, {
                            header: true,
                            complete: (result) => {
                                setExcelData(result.data);
                            },
                            error: (error) => {
                                console.error('Error parsing CSV file:', error);
                            },
                        });
                    } else {
                        console.error('Unsupported file format');
                    }
                } catch (error) {
                    console.error('Error parsing file:', error);
                } finally {
                    setInputValue('')
                }
            };

            if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                reader.readAsArrayBuffer(file);
            } else if (fileExtension === 'csv') {
                reader.readAsText(file);
            }
        }
    };

    return (
        <>
            <Button size={"sm"} colorScheme={"green"} isDisabled={disabled} onClick={toggleUpload}>{button || "Upload File"}</Button>
            <Input ref={inputRef} display={"none"} type="file" value={inputValue} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" />
        </>
    );
};

export default UploadExcel;

