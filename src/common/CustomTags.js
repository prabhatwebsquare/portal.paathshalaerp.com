import { Flex } from "@chakra-ui/react";

export const CustomTag = ({ colorScheme, icon, title }) => {
    return (
        <Flex minW={"120px"} py={1} px={3} align={"center"} border={"1px solid"} borderColor={`${colorScheme}.400`} borderRadius={50} color={`${colorScheme}.400`}>{icon} &nbsp;&nbsp;{title}</Flex>
    )
}