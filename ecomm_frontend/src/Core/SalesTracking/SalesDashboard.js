import React, { useEffect, useState } from "react";
import { getApi } from "../../api";
import {
  Typography, Grid, Card, CardContent, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody, Box
} from "@mui/material";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";

const SalesDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [s, d, t, r] = await Promise.all([
        getApi("sales/summary"),
        getApi("sales/by-day"),
        getApi("sales/top-products"),
        getApi("sales/recent-orders")
      ]);
      console.log("topProducts",t);
      setSummary(s);
      setDailySales(d);
      setTopProducts(t);
      setRecentOrders(r);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>📊 Sales Dashboard</Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {[
          { label: "Total Sales", value: `$${summary?.totalRevenue}` },
          { label: "Total Orders", value: summary?.totalOrders },
          { label: "Items Sold", value: summary?.totalItemsSold },
          { label: "Avg Order Value", value: `$${summary?.averageOrderValue}` }
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle1" color="textSecondary">{item.label}</Typography>
                <Typography variant="h5" fontWeight="bold">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mt={1}>
        {/* Line Chart */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>📈 Daily Sales</Typography>
              <ResponsiveContainer  height={300}>
                <LineChart data={Array.isArray(dailySales) ? dailySales : []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>🔥 Top Products</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Array.isArray(topProducts) ? topProducts : []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff5722" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders Table */}
      <Box mt={4}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>🧾 Recent Orders</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders?.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default SalesDashboard;
