import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardTitle } from "@/components/ui/card";
import { useGetAllPurchasedCourseQuery } from "@/features/api/purchaseApi";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

function Dashboard() {
  const { data, isSuccess, isError, isLoading } = useGetAllPurchasedCourseQuery();

  if (isLoading) return <h1>Loading........</h1>;
  if (isError) return <h1>Failed........</h1>;

  const { purchasedCourse = [] } = data || {};

  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId?.courseTitle || "Unknown",
    sales: course.courseId?.coursePrice || 0,
  }));

  const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
  const totalSales = purchasedCourse.length;

  // Optional: Monthly revenue chart data
  const monthlyData = {};
  purchasedCourse.forEach((entry) => {
    const date = new Date(entry.createdAt);
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    monthlyData[month] = (monthlyData[month] || 0) + (entry.amount || 0);
  });

  const timeSeriesData = Object.entries(monthlyData).map(([month, revenue]) => ({
    month,
    revenue,
  }));

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
          <CardTitle className="text-lg font-semibold">Total Sales</CardTitle>
          <p className="mt-2 text-2xl font-bold">{totalSales}</p>
        </Card>
        <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
          <CardTitle className="text-lg font-semibold">Total Revenue</CardTitle>
          <p className="mt-2 text-2xl font-bold">₹{totalRevenue}</p>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-6">
        <CardTitle className="text-lg font-semibold mb-4">Course Sales (Bar Chart)</CardTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={courseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" tickFormatter={(v) => `₹${v}`} />
            <Tooltip />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Chart */}
      <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl mb-6">
        <CardTitle className="text-lg font-semibold mb-4">Revenue Share (Pie Chart)</CardTitle>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={courseData}
              dataKey="sales"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {courseData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly Revenue Line Chart */}
      {timeSeriesData.length > 0 && (
        <Card className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl">
          <CardTitle className="text-lg font-semibold mb-4">Monthly Revenue (Line Chart)</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" tickFormatter={(v) => `₹${v}`} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
