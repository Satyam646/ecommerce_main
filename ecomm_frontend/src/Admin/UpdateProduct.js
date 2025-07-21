import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Input,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Paper
} from "@mui/material";
import { isAuthenticated } from "../Common/auth/auth";
import { putFormData, getApi } from "../api";
import { getSingleProduct } from "./Adminapi";
import { useLocation } from "react-router-dom";

export default function UpdateProduct() {
  const { user, token } = isAuthenticated();
  const location = useLocation();
  const ProductId = location?.pathname.split("/")[4];

  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    shipping: "",
    quantity: "",
    photo: null,
    loading: false,
    error: "",
    success: false,
    createdProduct: "",
    formData: new FormData()
  });

  const {
    name, description, price, category,
    shipping, quantity, photo, loading,
    error, success, createdProduct, formData
  } = values;

  useEffect(() => {
    getCategories();
    loadProduct();
  }, []);

  const getCategories = async () => {
    const data = await getApi("category");
    if (data?.error) {
      setValues(prev => ({ ...prev, error: data.error }));
    } else {
      setCategories(data.category);
    }
  };

  const loadProduct = async () => {
    const data = await getSingleProduct(ProductId);
    if (data?.error) {
      setValues(prev => ({ ...prev, error: data.error }));
    } else {
      formData.set("name", data.name);
      formData.set("description", data.description);
      formData.set("price", data.price);
      formData.set("category", data.category?._id);
      formData.set("shipping", data.shipping ? 1 : 0);
      formData.set("quantity", data.quantity);

      setValues(prev => ({
        ...prev,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category?._id,
        shipping: data.shipping ? 1 : 0,
        quantity: data.quantity
      }));
    }
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues(prev => ({
      ...prev,
      [name]: value,
      error: "",
      success: false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues(prev => ({ ...prev, loading: true }));

    const userId = localStorage.getItem("userId");
    const token = JSON.parse(isAuthenticated()).token;

    const result = await putFormData(`product/update/${userId}/${ProductId}`, formData, token);
    const res = await result.json();

    if (!result.ok) {
      setValues(prev => ({ ...prev, error: res?.error || "Update failed", loading: false }));
    } else {
      setValues(prev => ({
        ...prev,
        success: true,
        loading: false,
        error: "",
        createdProduct: res.name
      }));
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 700, margin: "auto", mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Update Product
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {createdProduct} updated successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Button variant="contained" component="label">
              Upload New Photo
              <input hidden type="file" name="photo" accept="image/*" onChange={handleChange("photo")} />
            </Button>
            {photo && (
              <>
                <Typography variant="body2" color="text.secondary">
                  Selected: {photo.name}
                </Typography>
                <img
                  src={URL.createObjectURL(photo)}
                  alt="preview"
                  style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                />
              </>
            )}
          </Stack>

          <TextField
            label="Product Name"
            value={name}
            onChange={handleChange("name")}
            required
            fullWidth
          />

          <TextField
            label="Product Description"
            value={description}
            onChange={handleChange("description")}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Price"
            value={price}
            onChange={handleChange("price")}
            type="number"
            required
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={handleChange("category")}
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Quantity"
            value={quantity}
            onChange={handleChange("quantity")}
            type="number"
            required
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Shipping</InputLabel>
            <Select
              value={shipping}
              label="Shipping"
              onChange={handleChange("shipping")}
              required
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
            sx={{ alignSelf: "flex-start" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Update Product"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
