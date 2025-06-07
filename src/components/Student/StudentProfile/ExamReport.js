import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { map, sumBy } from 'lodash';
import React from 'react';
import { MdCurrencyRupee } from 'react-icons/md';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const ExamReport = () => {
    return (
        <Flex flexDir={"column"} align={"center"} justify={"center"}>
            <Table>
                <Thead>
                    <Tr>
                        <Th>Exam</Th>
                        <Th>Total Marks</Th>
                        <Th>Obt. Marks</Th>
                        <Th>Percentage</Th>
                        <Th>Rank</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {map(new Array(5), (a, i) => (
                        <Tr>
                            <Td>{i + 1} Term</Td>
                            <Td>100</Td>
                            <Td>90</Td>
                            <Td>90%</Td>
                            <Td>2</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Flex >
    );
}