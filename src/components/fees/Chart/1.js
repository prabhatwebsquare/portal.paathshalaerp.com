import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { month: "Feb", FeesCollection: 3000, Discounts: 1530 },
  { month: "Jan", FeesCollection: 4000, Discounts: 1000 },
  { month: "Mar", FeesCollection: 2000, Discounts: 1000 },
  { month: "Apr", FeesCollection: 2780, Discounts: 1080 },
  { month: "May", FeesCollection: 1890, Discounts: 900 },
  { month: "Jun", FeesCollection: 2390, Discounts: 1200 },
  { month: "July", FeesCollection: 3490, Discounts: 2500 },
  { month: "Aug", FeesCollection: 2000, Discounts: 1000 },
  { month: "Sep", FeesCollection: 2780, Discounts: 1800 },
  { month: "Oct", FeesCollection: 1890, Discounts: 900 },
  { month: "Nov", FeesCollection: 2390, Discounts: 1200 },
  { month: "Dec", FeesCollection: 3490, Discounts: 2500 },
];

const MonthlyEarningsDiscountsChart = () => (
  <BarChart
    width={700}
    height={350}
    data={data}
    margin={{
      top: 20,
      right: 0,
      left: 0,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" style={{ fontWeight: "bold" }} />
    <YAxis style={{ fontSize: 13, fontWeight: "bold" }} />
    <Tooltip />
    <Legend />
    <Bar dataKey="FeesCollection" label="Fees Collection" fill="#097969" />
  </BarChart>
);

export default MonthlyEarningsDiscountsChart;
