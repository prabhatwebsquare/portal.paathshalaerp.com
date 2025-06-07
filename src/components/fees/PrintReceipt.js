import { NumberToWords } from "@/constant/NumToWords";
import {
  Box,
  Flex,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { MdCurrencyRupee } from "react-icons/md";

export const PrintReceipt = ({ printProps }) => {
  return (
    <Box
      m={4}
      p={2}
      border={"1px solid"}
      borderColor={"gray.200"}
      borderRadius={5}
    >
      <Flex h={"90px"} borderBottom={"1px solid"} borderColor={"gray.200"}>
        <Box w={"25%"} align={"flex-start"}>
          <Image w="60%" h={"90%"} src="/assets/login2.png" alt="" />
        </Box>
        <Box w={"50%"} align={"center"}>
          <Text fontSize={22} fontWeight={"semibold"}>
            Smart Paathshala
          </Text>
          <Text fontSize={13}>
            311,3rd Floor, Center Tower, Central Spine , Vidhyadhar Nagar,
            Jaipur-302023
          </Text>
        </Box>
        <Box w={"25%"}>
          <Flex w="100%" justify={"flex-end"}>
            <Text w="fit-content">Date:</Text>
            <Text w="fit-content">{dayjs().format("DD-MM-YYYY")}</Text>
          </Flex>
        </Box>
      </Flex>
      <Flex py={2} borderBottom={"1px solid"} borderColor={"gray.200"}>
        <Box w="60%" fontSize={12}>
          <Flex align={"center"}>
            <Text w="30%">SR No. </Text>
            <Text ml={2} fontWeight={"semibold"}>
              : 101
            </Text>
          </Flex>
          <Flex align={"center"}>
            <Text w="30%">Student Name </Text>
            <Text ml={2} fontWeight={"semibold"}>
              : Manish Rajput
            </Text>
          </Flex>
          <Flex align={"center"}>
            <Text w="30%">Father&apos;s Name </Text>
            <Text ml={2} fontWeight={"semibold"}>
              : Abhishek
            </Text>
          </Flex>
          <Flex align={"center"}>
            <Text w="30%">Mother&apos;s Name </Text>
            <Text ml={2} fontWeight={"semibold"}>
              : Ranjana
            </Text>
          </Flex>
          <Flex align={"center"}>
            <Text w="30%">Class </Text>
            <Text ml={2} fontWeight={"semibold"}>
              : 10th - Science
            </Text>
          </Flex>
        </Box>
        <Flex flexDir={"column"} w="40%" align="flex-end">
          <Text fontWeight={"semibold"}>FEES RECEIPT</Text>
          <Flex
            w="fit-content"
            fontWeight={"semibold"}
            color={"green.400"}
            fontSize={13}
          >
            <Text>Receipt No</Text>
            <Text ml={1}>: 12092</Text>
          </Flex>
          <Text w="fit-content" fontSize={12}>
            {dayjs().format("MMMM DD, YYYY")}
          </Text>
        </Flex>
      </Flex>
      <Box py={2} borderBottom={"1px solid"} borderColor={"gray.200"}>
        <Table size={"sm"}>
          <Thead>
            <Tr>
              <Th w="8%">Sr No.</Th>
              <Th>Particular</Th>
              <Th w={"15%"}>
                <Flex align={"center"}>
                  {"Deposit ( "} <MdCurrencyRupee />
                  {" )"}
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody fontSize={12}>
            <Tr>
              <Td>2</Td>
              <Td>2st Installment</Td>
              <Td fontWeight={"semibold"}>110000</Td>
            </Tr>
            <Tr>
              <Td>2</Td>
              <Td>2st Installment</Td>
              <Td fontWeight={"semibold"}>110000</Td>
            </Tr>
            <Tr>
              <Td>2</Td>
              <Td>2st Installment</Td>
              <Td fontWeight={"semibold"}>110000</Td>
            </Tr>
            <Tr>
              <Td>2</Td>
              <Td>2st Installment</Td>
              <Td fontWeight={"semibold"}>110000</Td>
            </Tr>
            <Tr>
              <Td>2</Td>
              <Td>2st Installment</Td>
              <Td fontWeight={"semibold"}>110000</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      <Flex>
        <Box w="70%">
          <Flex fontSize={12}>
            <Text fontWeight={"semibold"}>IN WORDS :</Text>
            <Text ml={1}>{NumberToWords(1000000)}</Text>
          </Flex>
          <Flex fontSize={12}>
            <Text fontWeight={"semibold"}>Remark :</Text>
            <Text ml={1}></Text>
          </Flex>
        </Box>
        <Box w="30%">
          <Flex fontSize={12}>
            <Text fontWeight={"semibold"}>Total :</Text>
            <Text ml={1}>1000000</Text>
          </Flex>
          <Flex fontSize={12}>
            <Text fontWeight={"semibold"}>Payment Mode :</Text>
            <Text ml={1}>Net Banking</Text>
          </Flex>
          <Flex fontSize={12}>
            <Text fontWeight={"semibold"}>Transaction No. :</Text>
            <Text ml={1}>1PCMND09MNS494NV</Text>
          </Flex>
        </Box>
      </Flex>
      <Flex justify={"flex-end"}>
        <Text
          mt={7}
          fontSize={11}
          w="fit-content"
          borderTop={"1px solid"}
          borderColor={"gray.200"}
        >
          Authorised Signature
        </Text>
      </Flex>
    </Box>
  );
};
