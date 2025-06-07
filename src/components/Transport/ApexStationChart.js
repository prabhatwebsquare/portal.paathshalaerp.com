import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Chart from "react-apexcharts";

const ApexStationChart = () => {
    const options = {
        series: [{
            name: 'Student',
            data: [20, 34, 17, 28, 9, 36]
        }],
        chart: {
            height: 220,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        xaxis: {
            categories: ["StationA", "StationB", "StationC", "StationD", "StationE", "StationF"],
            position: 'bottom',
            axisBorder: {
                show: true
            },
            axisTicks: {
                show: true
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: true
            },
            axisTicks: {
                show: true,
            },
            labels: {
                show: true,
                formatter: function (val) {
                    return val;
                }
            }
        },
        title: {
            text: 'Student Station List',
            floating: true,
            offsetY: 240,
            align: 'center',
            style: {
                color: '#444'
            }
        }
    };

    return (
        <Box w={"49%"} border={"1px solid"} borderColor={"gray.200"}>
            <Text p={2} fontSize={16} fontWeight={"semibold"}>Student Station</Text>
            <Flex borderTop={"1px solid"} borderColor={"gray.200"} px={2} py={5} justify={"center"}>
                <Chart options={options} series={options.series} type="bar" width={400} height={260} />
            </Flex>
        </Box>
    );
};

export default ApexStationChart;
