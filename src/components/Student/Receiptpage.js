import { Box, Text, VStack, HStack, Grid, GridItem, Stack } from "@chakra-ui/react";

function Receiptpage() {
  const DottedLine = ({ width = "90%", children }) => (
    <Box
      borderBottom="1px dotted black"
      width={width}
      height="1.2em"
      display="inline-block"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
    >
      {children}
    </Box>
  );
  return (
    <Box
      width={{ base: "95%", sm: "90%", md: "800px" }}
      mx="auto"
      p={{ base: 4, md: 6 }}
      border="1px solid black"
      fontSize={{ base: "12px", md: "14px" }}
      lineHeight="1.2"
      fontFamily="Arial, sans-serif"
      mt={{ base: 4, md: 10 }}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        mb={6}
        spacing={{ base: 2, md: 0 }}
        alignItems="center"
      >
        <Text fontWeight="bold" fontSize={{ base: "18px", md: "20px" }}>
          Schoollog
        </Text>
        <Text fontWeight="bold" textAlign="center">
          RECEIPT
        </Text>
        <VStack spacing={1} alignItems={{ base: "flex-start", md: "flex-end" }}>
          <Text>Date: 15-01-2025</Text>
          <Text>No: LB2400764</Text>
        </VStack>
      </Stack>
      <VStack align="stretch" spacing={3} mt={6} mb={6}>
        {[
          { label: "Client:", value: "Sony academy Bharatpur" },
          { label: "Amount (Words):", value: "Rs. FIFTY THOUSAND RUPEES ONLY" },
          { label: "Payment Of:", value: "SL11036" },
          { label: "Received By:", value: "Schoollog" },
          { label: "Paid By:", value: "Wallet" },
        ].map((item, index) => (
          <Grid
            key={index}
            templateColumns={{ base: "1fr", md: "200px 1fr" }}
            gap={{ base: 2, md: 4 }}
          >
            <GridItem fontWeight="bold">
              <Text>{item.label}</Text>
            </GridItem>
            <GridItem>
              <DottedLine>{item.value}</DottedLine>
            </GridItem>
          </Grid>
        ))}
      </VStack>
      <HStack
        justifyContent={{ base: "space-between", md: "flex-end" }}
        mt={4}
        wrap="wrap"
        alignItems="center"
      >
        <Text fontWeight="bold" mr={{ base: 0, md: 2 }} textAlign="center">
          Amount:
        </Text>
        <Box
          border="1px solid black"
          borderRadius="md"
          p={3}
          w={{ base: "100%", sm: "70%", md: "200px" }}
          textAlign="center"
          bg="gray.50"
        >
          ₹ 50000.00
        </Box>
      </HStack>
      <HStack mt={2} justifyContent={{ base: "center", md: "flex-start" }}>
        <Text fontWeight="bold">Remark:</Text>
      </HStack>
    </Box>
  );
}

export default Receiptpage;
