import { STATUS } from "@/constant"
import { Flex, Spinner } from "@chakra-ui/react"

export const LoadingContainer = ({ status, children }) => {
    return (
        status === STATUS.FETCHING ?
            <Flex h={"100%"} justify={"center"} align={"center"}>
                <Spinner size={"lg"} />
            </Flex>
            :
            children
    )
}