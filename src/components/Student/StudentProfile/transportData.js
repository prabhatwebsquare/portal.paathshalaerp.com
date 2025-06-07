import { Box, Flex, Text } from '@chakra-ui/react';
import { MdCurrencyRupee } from 'react-icons/md';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import React from 'react';
import { map, sumBy } from 'lodash';

const COLORS = ['#0FE000', '#1F75FF', '#FF8042', '#FF4747'];
const TOTAL_COLOR  = "#A0AEC0"; // Gray for total
const transformData = (data) => {
  return [
    { name: 'Deposite Fees', value: data?.transportTotalFeesCollect || 0, color: COLORS[0] },
    { name: 'Late Fees', value: data?.transportTotalLateFesCollect || 0, color: COLORS[1] },
    { name: 'Discount', value: data?.transportTotalDiscountCollect || 0, color: COLORS[2] },
    { name: 'Due Fees', value: data?.transportTotalDue || 0, color: COLORS[3] },
  ];
};

export const TransportFeesSummary = ({ data }) => {
    
  const transportData = transformData(data);

  return (
    <Flex
      flexDir="column"
      align="center"
      justify="center"
      p={4}
      boxShadow="md"
      borderRadius="md"
      bg="white"
      w="100%"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
      Transport Fee Summary</Text>

      <PieChart width={250} height={160}>
        <Pie
          data={transportData}
          innerRadius={50}
          outerRadius={70}
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
        >
          {transportData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <Flex w={"100%"} mt={3} gap={1} justify={"space-between"} flexWrap="wrap">
                <Flex fontWeight={"semibold"} mb={2}>
                    <Text w={"4px"} h={"100%"} bg={TOTAL_COLOR} borderRightRadius={19} />
                    <Box pl={2}>
                        <Text fontSize={14}>Total Fees</Text>
                        <Flex align={"center"} fontSize={13}><MdCurrencyRupee />{sumBy(transportData, "value")}</Flex>
                    </Box>
                </Flex>
                {map(transportData, (d, i) => (
                    <Flex fontWeight={"semibold"} mb={2} key={i}>
                        <Text w={"4px"} h={"100%"} bg={d.color} borderRightRadius={19} />
                        <Box pl={1}>
                            <Text fontSize={14}>{d.name}</Text>
                            <Flex align={"center"} fontSize={13}><MdCurrencyRupee />{d.value}</Flex>
                        </Box>
                    </Flex>
                ))}
            </Flex>
    </Flex>
  );
};
