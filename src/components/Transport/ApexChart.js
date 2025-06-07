import { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import ReactApexChart from 'react-apexcharts';

function ApexChart() {
  const [chartData, setChartData] = useState({
    series: [70000, 25000, 5000],
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      labels: ['Deposit', 'Pending', 'Discount'],
      colors: ['#00e39b', '#e6a307', '#0b88db'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  });

  return (
    <Box w={"49%"} border={"1px solid"} borderColor={"gray.200"}>
      <Text p={2} fontSize={16} fontWeight={"semibold"}>Transport Fees</Text>
      <Flex borderTop={"1px solid"} borderColor={"gray.200"} px={2} py={5} justify={"center"}>
        <ReactApexChart options={chartData.options} series={chartData.series} type="donut" width={380} />
      </Flex>
    </Box>
  );
}

export default ApexChart;
