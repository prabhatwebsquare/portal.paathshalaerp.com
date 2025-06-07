import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

export const MyTable = () => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Age</Th>
          <Th>City</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>John</Td>
          <Td>25</Td>
          <Td>New York</Td>
        </Tr>
        <Tr>
          <Td>Jane</Td>
          <Td>30</Td>
          <Td>London</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
