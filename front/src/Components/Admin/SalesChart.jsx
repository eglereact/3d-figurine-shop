import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const SalesChart = ({ salesData }) => {
  const [isAreaChart, setIsAreaChart] = useState(false);

  const toggleChart = () => {
    setIsAreaChart((prev) => !prev); // Toggle between Bar and Area chart
  };

  return (
    <div>
      <div className="w-full flex justify-center my-2">
        <button onClick={toggleChart} className="grey-button p-2">
          {isAreaChart ? "Switch to Bar Chart" : "Switch to Area Chart"}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {isAreaChart ? (
          <AreaChart data={salesData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#F9F3F1"
              fill="#3a3a3e"
            />
          </AreaChart>
        ) : (
          <BarChart data={salesData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#3a3a3e" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
