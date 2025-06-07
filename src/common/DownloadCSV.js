import React from 'react';
import { Button } from "@chakra-ui/react";
import * as XLSX from 'xlsx';
import { getLocalStorageItem } from '@/utils/LocalStorage';

export const DownloadCSV = ({ disabled, button, name, data }) => {
    const themeColor = getLocalStorageItem("themeColor") || "blue"

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${name}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button size={"sm"} isDisabled={disabled} colorScheme={themeColor} onClick={handleDownload}>
            {button ? button : "Download Template"}
        </Button>
    );
};
