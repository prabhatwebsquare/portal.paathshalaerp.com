import React from 'react';
import {
  Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, 
  CircularProgress, CircularProgressLabel, Progress, Text, 
  Flex, Heading, Divider
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Pie, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

const DummyDashboard = () => {
  const revenueData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Revenue',
        data: [120000, 190000, 300000, 500000, 200000, 350000],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  const expensesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Expenses',
        data: [100000, 150000, 200000, 250000, 150000, 180000],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const productStatusData = {
    labels: ['Active', 'Out of Stock', 'Inactive'],
    datasets: [
      {
        data: [73, 18, 9],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
  };

  const volumeByCategoryData = {
    labels: ['Suits', 'Shirts', 'Trousers', 'Shoes', 'Jackets', 'Accessories'],
    datasets: [
      {
        label: 'Volume',
        data: [65, 59, 90, 81, 56, 55],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
      },
    ],
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <Box mb={8}>
        <Heading as="h2" size="lg">Welcome Back, <Text as="span" color="orange.400">Mark</Text></Heading>
        <Text fontSize="md" color="gray.600">
          See what’s going on with your store, from sales, revenues, expenses, all the way to insights.
        </Text>
      </Box>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="8">
        <StatCard 
          title="Revenue" 
          amount="$532,812.21" 
          percentage="27%" 
          comparedTo="$243,145.16" 
          chart={<Line data={revenueData} />}
        />
        <StatCard 
          title="Expenses" 
          amount="$232,673.54" 
          percentage="-16%" 
          comparedTo="$416,783.26" 
          chart={<Line data={expensesData} />}
        />
        <PerformanceScore score={84} />
        <ProductStatus data={productStatusData} />
        <ProductFeedback percentage={65} />
        <VolumeByCategory data={volumeByCategoryData} />
      </SimpleGrid>
      <AnalyticsSection />
    </Box>
  );
};

const StatCard = ({ title, amount, percentage, comparedTo, chart }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
    <Stat>
      <StatLabel>{title}</StatLabel>
      <StatNumber>{amount}</StatNumber>
      <StatHelpText>
        Compared to last month ({comparedTo})
      </StatHelpText>
      <Box mt={4}>
        {chart}
      </Box>
    </Stat>
  </Box>
);

const PerformanceScore = ({ score }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
    <Text mb={2} fontSize="lg">Performance Score</Text>
    <CircularProgress value={score} color="orange.400">
      <CircularProgressLabel>{score}/100</CircularProgressLabel>
    </CircularProgress>
    <Text mt={2}>You&apos;re Doing Great! The score for your store performance is really good. Keep up the good work!</Text>
  </Box>
);

const ProductStatus = ({ data }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
    <Text mb={2} fontSize="lg">Product Status</Text>
    <Pie data={data} />
  </Box>
);

const ProductFeedback = ({ percentage }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
    <Text mb={2} fontSize="lg">Product Feedback</Text>
    <Progress value={percentage} size="lg" colorScheme="blue" />
    <Text mt={2}>Percentage of buyers that leave favorable reviews.</Text>
  </Box>
);

const VolumeByCategory = ({ data }) => (
  <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
    <Text mb={2} fontSize="lg">Volume by Category</Text>
    <Radar data={data} />
  </Box>
);

const AnalyticsSection = () => (
  <Box mt={8} p={5} bg="orange.100" borderRadius="md">
    <Heading as="h3" size="md" mb={2}>Take a Look at Your Analytics</Heading>
    <Text>Get a more detailed look at your analytics through the analytics section.</Text>
  </Box>
);

export default DummyDashboard;
