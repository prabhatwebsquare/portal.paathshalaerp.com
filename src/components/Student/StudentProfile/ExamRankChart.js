import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Exam 1", percentage: 85, rank: 5 },
  { name: "Exam 2", percentage: 90, rank: 3 },
  { name: "Exam 3", percentage: 88, rank: 4 },
  { name: "Exam 4", percentage: 95, rank: 2 },
  { name: "Exam 5", percentage: 92, rank: 1 },
];

const ExamChart = () => {
  return (
    // <ResponsiveContainer width="100%" height={400}>
      <LineChart width={450} height={200} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="percentage"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="rank" stroke="#82ca9d" />
      </LineChart>
    // </ResponsiveContainer>
  );
};

export default ExamChart;
