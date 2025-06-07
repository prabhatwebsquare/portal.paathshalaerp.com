import React, { useState } from 'react';
import { Box, Button, Flex, IconButton, Select, Text } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

const Pagination = ({ totalItems, currentPage, setCurrentPage, limit, setLimit, themeColor }) => {
    const totalPages = Math.ceil(totalItems / limit);

    const handleLimit = (val) => {
        setLimit(val)
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <Flex w={"300px"} justify="center" gap={2} align={"center"}>
            <Select mr={4} size={"sm"} value={limit} focusBorderColor={`${themeColor}.400`} onChange={(e) => handleLimit(e.target.value)}>
                <option value={10}>10 Per Page</option>
                <option value={20}>20 Per Page</option>
                <option value={50}>50 Per Page</option>
                <option value={100}>100 Per Page</option>
            </Select>
            <Flex w={"fit-content"} gap={2}>
                <IconButton size={"xs"} colorScheme={themeColor} isDisabled={currentPage === 1} onClick={handlePrevPage} icon={<ArrowLeftIcon />} />
                <Text fontWeight={"semibold"}>{currentPage || 0}</Text>
                <Text> - </Text>
                <Text>{totalPages || 0}</Text>
                <IconButton size={"xs"} colorScheme={themeColor} isDisabled={currentPage === totalPages} onClick={handleNextPage} icon={<ArrowRightIcon />} />
            </Flex>
        </Flex>
    );
};

export default Pagination;
