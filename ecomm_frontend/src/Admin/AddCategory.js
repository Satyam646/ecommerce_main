import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Alert,
  CircularProgress
} from "@mui/material";
import { postAuthApi } from "../api";
import { isAuthenticated } from "../Common/auth/auth";

const AddCategory = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    loading: false
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, success: false, [name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });

    const userId = localStorage.getItem("userId");
    const token = JSON.parse(isAuthenticated()).token;

    const body = { name: values.name };
    const result = await postAuthApi(`category/create/${userId}`, body, token);
    const res = await result.json();

    if (!result.ok) {
      setValues({ ...values, error: res?.error || "Something went wrong", loading: false });
    } else {
      setValues({ name: "", error: false, success: true, loading: false });
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 500, margin: "auto", mt: 6, p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add New Category
      </Typography>

      {values.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {values.error || "Category name must be unique."}
        </Alert>
      )}

      {values.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Category created successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Category Name"
            value={values.name}
            onChange={handleChange("name")}
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={values.loading}
          >
            {values.loading ? <CircularProgress size={24} color="inherit" /> : "Add Category"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default AddCategory;
