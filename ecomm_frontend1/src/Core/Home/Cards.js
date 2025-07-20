import React, { useState } from "react";
import { API } from "../../config";
import { Stack, Button, TextField, Typography, useMediaQuery, useTheme, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { AddItem } from "../Cart/AddItem";
import { updateItemCount } from "../Cart/AddItem";
import { removeItemFromCart } from "../Cart/AddItem";
import { useContext } from "react";
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';

export default function Card({ product, onCart = true, UpdateCart }) {
  const { toggleSnackBar } = useContext(ThemeContext)
  const theme = useTheme();
  const navigate = useNavigate();
  const path = `${API}product/photo/${product?._id}`;
  const [count, setCount] = useState(product?.count);
  const handleChange = id => event => {
    setCount(event.target.value > 1 ? event.target.value : 1);
    if (event.target.value >= 1) {
      updateItemCount(id, event.target.value);
    }
    UpdateCart();
  }
  const ShowStock = (quantity) => {
    return (
      quantity > 0 ? <Stack sx={{ bgcolor: "lightgreen", width: "50px", alignItems: "center", borderRadius: "3px" }}><Typography>Stock</Typography></Stack> : <Stack sx={{ bgcolor: "red", width: "80px", alignItems: "center", borderRadius: "3px" }}>StockOut</Stack>
    )
  }
  //  return (
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      onClick={() => onCart && navigate(`/product/${product?._id}`)}
      sx={{
        bgcolor: "#f5f5f5",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
        width: isMobile ? "100%" : 300,

        transition: "transform 0.3s",
        '&:hover': {
          transform: "scale(1.02)",
          cursor: "pointer",
        },
      }}
    >
      <Box sx={{ p: 2, }} onClick={() => navigate(`/product/${product?._id}`)}>
        <img
          src={path}
          alt={product?.name}
          height="320px"
          width="270px"
        />
      </Box>
      <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {product?.name}
        </Typography>
        <Typography variant="subtitle1" color="text.primary">
          Price: ${product?.price}
        </Typography>
        {ShowStock(product?.quantity)}
        {!onCart && (
          <TextField
            label="Quantity"
            type="number"
            variant="standard"
            value={count}
            onChange={handleChange(product._id)}
            fullWidth
          />
        )}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {!onCart && (
            <Button
              variant="outlined"
              color="error"
              fullWidth={isMobile}
              onClick={() => {
                removeItemFromCart(product?._id);
                UpdateCart();
              }}
            >
              Remove Item
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};