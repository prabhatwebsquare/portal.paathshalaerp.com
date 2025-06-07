import React from 'react';
import { Button } from "@chakra-ui/react";
import * as XLSX from 'xlsx';
import { getLocalStorageItem } from '@/utils/LocalStorage';

export const DownloadExcel = ({ disabled, button, name, data }) => {
    const themeColor = getLocalStorageItem("themeColor") || "blue"

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'data');
        XLSX.writeFile(workbook, `${name}.xlsx`);
    };

    return (
        <Button size={"sm"} isDisabled={disabled} colorScheme={themeColor} onClick={handleDownload}>
            {button ? button : "Download Template"}
        </Button>
    );
};