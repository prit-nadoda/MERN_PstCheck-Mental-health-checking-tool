import React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MyAreaChart = ({ data, height = 150, fontSize = "0.675rem" }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{ top: 30, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: fontSize }} // Adjust X-axis label font size
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: fontSize }} // Adjust Y-axis label font size
        />
        <Tooltip contentStyle={{ fontSize: fontSize }} />
        <Legend
          wrapperStyle={{ fontSize: fontSize }} // Adjust legend font size
        />
        <Area type="monotone" dataKey="score" stroke="#2563eb" fill="#3b82f6" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MyAreaChart;
