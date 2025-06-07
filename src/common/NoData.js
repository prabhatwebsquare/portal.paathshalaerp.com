import { Flex, Image, Text } from "@chakra-ui/react"
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
// import animationData from "../../public/assets/notfound.json";

export const NoData = ({ title }) => {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        import('../../public/assets/notfound.json').then(data => setAnimationData(data.default));
    }, []);

    if (!animationData) return null;

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <Flex flexDir={"column"} align={"center"} pt={4}>
            {/* <Image h={"300"} src={"/assets/nodata.avif"} alt={"No Data"} /> */}
            <Lottie options={defaultOptions} height={300} width={400} />
            <Text mt={2} fontWeight={"semibold"} fontSize={18}>{title}</Text>
        </Flex>
    )
}