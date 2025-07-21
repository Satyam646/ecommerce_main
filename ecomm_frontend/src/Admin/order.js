import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../Common/auth/auth";
import { Stack, Typography, Avatar, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Divider } from "@mui/material";
import { getApiAuth, updateOrderStatus } from "../api";
import { API } from "../config";
function Orders() {
  const [data, setData] = useState([]);
  const [values, setValues] = useState([]);
  const [status, setStatus] = useState("");
  const userId = JSON.parse(isAuthenticated())?.user._id;
  const token = JSON.parse(isAuthenticated())?.token;
  const getTotal = (products) => {
    let sum = 0;
    products.map((item) => sum = sum + item?.price);
    return sum;
  }
  const getOrderHistory = () => {
    const userId = JSON.parse(isAuthenticated())?.user._id;
    const token = JSON.parse(isAuthenticated())?.token;
    getApiAuth(`order/list/${userId}`, token).then(data => {
      if (data?.error) {
        //    setData({...data,error:data?.error});
        console.log("error fetching data from backend");
      } else {
        setData(data);
      }
    })
  }
  const handleChange = (orderId, event) => {
    setStatus(event.target.value);
    updateOrderStatus(userId, token, orderId, event.target.value).then(data => {
      if (data.error) {
        console.log('Status Update Failed');
      } else {
        getOrderHistory();
      }
    })
  }
  const getStatusValues = () => {
    const userId = JSON.parse(isAuthenticated())?.user._id;
    const token = JSON.parse(isAuthenticated())?.token;
    getApiAuth(`order/status-values/${userId}`, token).then(data => {
      if (data?.error) {
        console.log("error fetching data from backend");
      } else {
        console.log(data, "dropdown");
        setValues(data);
      }
    })
  }
  const Order = () => {
    return (
      <Stack spacing={3} sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
        {data?.map((orderItem, indx) => (
          <Card key={orderItem?._id} sx={{ border: "2px solid green", borderRadius: 2, boxShadow: 3, padding: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                {indx + 1}. Order ID: {orderItem?._id}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Current Status: {orderItem?.status}</Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Change Status</InputLabel>
                <Select value={orderItem?.status} label="Change Status" onChange={(event) => handleChange(orderItem?._id, event)}>
                  {values.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="h6" sx={{ mt: 2 }}>Amount: ${getTotal(orderItem?.products)}</Typography>
              <Typography variant="h6">Order By: {orderItem?.user.name}</Typography>
              <Typography variant="h6">Order On: {new Date(orderItem?.createdAt).toLocaleString()}</Typography>
              <Typography variant="h6">Delivery Address: {orderItem?.address}</Typography>
              <Stack sx={{ mt: 3 }}>
                <Typography variant='h5' fontWeight="bold">Product Details</Typography>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  {orderItem?.products.map((item, index) => (
                    <Card key={item._id} sx={{ border: "2px solid blue", borderRadius: 2, padding: 2 }}>
                      <CardContent>
                        <img src={`${API}product/photo/${item?._id}`} alt={item?.name} sx={{ width: 64, height: 64 }} />
                        <Typography variant="h6">Product Name: {item?.name}</Typography>
                        <Typography variant="h6">Price: ${item?.price}</Typography>
                        <Typography variant="h6">Quantity: {item?.count}</Typography>
                        <Typography variant="h6">Product ID: {item?._id}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    )
  }
  useEffect(() => {
    getOrderHistory();
    getStatusValues();
  }, []);

  return (
    <Stack>
      {Order()}
    </Stack>
  )
}
export default Orders