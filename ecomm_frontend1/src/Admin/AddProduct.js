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
import { postFormData, getApi } from "../api";

export default function AddProduct() {
  const { user, token } = isAuthenticated();
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    shipping: "",
    quantity: "",
    photo: null,
    loading: false,
    error: "",
    success: false,
    createdProduct: "",
    formData: new FormData(),
  });

  const {
    name, description, price, categories, category,
    shipping, quantity, loading, error, success, createdProduct, formData
  } = values;

  useEffect(() => {
    getApi("category").then(data => {
      if (data?.error) {
        setValues(prev => ({ ...prev, error: data.error }));
      } else {
        setValues(prev => ({ ...prev, categories: data.category }));
      }
    });
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues(prev => ({
      ...prev,
      [name]: value,
      error: "",
      success: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues(prev => ({ ...prev, loading: true }));

    const userId = localStorage.getItem("userId");
    const token = JSON.parse(isAuthenticated()).token;
    const result = await postFormData(`product/create/${userId}`, formData, token);
    const res = await result.json();

    if (!result.ok) {
      setValues(prev => ({ ...prev, error: res?.error || "Failed to create product", loading: false }));
    } else {
      setValues(prev => ({
        ...prev,
        name: "",
        description: "",
        price: "",
        category: "",
        shipping: "",
        quantity: "",
        photo: null,
        success: true,
        error: "",
        loading: false,
        createdProduct: res.name,
        formData: new FormData(),
      }));
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{createdProduct} added successfully!</Alert>}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Button variant="contained" component="label">
              Upload Product Image
              <input hidden type="file" accept="image/*" onChange={handleChange("photo")} />
            </Button>
            {values.photo && (
              <Typography variant="body2" color="textSecondary">
                Selected file: {values.photo.name}
              </Typography>
            )}
            {values.photo && (
              <img
                src={URL.createObjectURL(values.photo)}
                alt="Preview"
                style={{ maxWidth: "100%", height: "300", width:"200", borderRadius: 8, marginTop: 8 }}
              />
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
              onChange={handleChange("category")}
              label="Category"
              required
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
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
              onChange={handleChange("shipping")}
              label="Shipping"
              required
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Product"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>
  );
}
