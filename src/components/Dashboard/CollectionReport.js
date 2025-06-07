import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Chart from "react-apexcharts";

export const CollectionReport = ({ depositData, pendingData, discountData }) => {
    const options = {
        series: [
            {
                name: "Deposit",
                data: depositData,
            },
            {
                name: "Pending",
                data: pendingData,
            },
            {
                name: "Discount",
                data: discountData,
            },
        ],
        colors: ['#00e39b', '#e6a307', '#0b88db'],
        chart: {
            height: 300,
            type: "line",
            zoom: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [5, 7, 5],
            curve: "straight",
            dashArray: [0, 8, 5],
        },
        title: {
            text: "Monthly Collection Report",
            align: "left",
        },
        legend: {
            tooltipHoverFormatter: function (val, opts) {
                return (
                    val + " - <strong>" + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + "</strong>"
                );
            },
        },
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6,
            },
        },
        xaxis: {
            categories: [
                "01 Jan",
                "02 Jan",
                "03 Jan",
                "04 Jan",
                "05 Jan",
                "06 Jan",
                "07 Jan",
                "08 Jan",
                "09 Jan",
                "10 Jan",
                "11 Jan",
                "12 Jan",
            ],
        },
        tooltip: {
            y: [
                {
                    title: {
                        formatter: function (val) {
                            return val;
                        },
                    },
                },
                {
                    title: {
                        formatter: function (val) {
                            return val;
                        },
                    },
                },
                {
                    title: {
                        formatter: function (val) {
                            return val;
                        },
                    },
                },
            ],
        },
        grid: {
            borderColor: "#f1f1f1",
        },
    };

    return (
        <Box w={"49%"} border={"1px solid"} borderColor={"gray.200"}>
            <Text p={2} fontSize={16} fontWeight={"semibold"}>Fees Collection Report</Text>
            <Flex w={"100%"} borderTop={"1px solid"} borderColor={"gray.200"} px={2} py={5} justify={"center"}>
                <Chart options={options} series={options.series} type="line" width={430} height={250} />
            </Flex>
        </Box>
    );
};;
