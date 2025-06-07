import { PageHeader } from "@/common/PageHeader"
import { Box, Flex } from "@chakra-ui/react"

export const Account = () => {
    return (
        <Box>
            <PageHeader heading={"Account"} />
            <Box p={5} bg={"white"} h={"75vh"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <Flex justify={"space-between"}>
                    </Flex>
                </Box>
            </Box>
        </Box>
    )
}