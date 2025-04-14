import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import { postApi } from "../api";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    error: "",
    success: false,
  });

  const { name, email, password, role } = values;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const body = { name, email, password, role };
    const result = await postApi("signup", body);
    if (!result.ok) {
      const res = await result.json();
      setValues({ ...values, error: res?.error });
    } else {
      setValues({ ...values, error: false, success: true });
    }
  };

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      error: false,
      success: false,
      [name]: event.target.value,
    });
  };

  const showSuccess = () =>
    values.success && (
      <Stack
        sx={{
          bgcolor: "#C8E6C9",
          padding: "16px",
          borderRadius: "10px",
          color: "#2E7D32",
          fontWeight: 500,
        }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        User created successfully!&nbsp;
        <Link style={{ textDecoration: "underline", color: "#1B5E20" }} to="/signin">
          Sign In
        </Link>
      </Stack>
    );

  const showError = () =>
    values.error && (
      <Stack
        sx={{
          bgcolor: "#FFCDD2",
          padding: "16px",
          borderRadius: "10px",
          color: "#C62828",
          fontWeight: 500,
        }}
      >
        {values.error}
      </Stack>
    );

  const showForm = () => (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Name"
          value={name}
          onChange={handleChange("name")}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Email"
          value={email}
          onChange={handleChange("email")}
          fullWidth
          variant="outlined"
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={handleChange("role")}>
            <MenuItem value={1}>Admin</MenuItem>
            <MenuItem value={0}>User</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handleChange("password")}
          fullWidth
          variant="outlined"
        />
        <Stack spacing={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              paddingY: "10px",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: "600",
              bgcolor: "#1976D2",
              "&:hover": { bgcolor: "#1565C0" },
            }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" textAlign="center">
            Already a user?{" "}
            <Link to="/signin" style={{ color: "#1976D2", textDecoration: "underline" }}>
              Sign In
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </form>
  );

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        padding: { xs: "20px", md: "60px" },
        background: "linear-gradient(135deg, #E0F7FA, #FFFFFF)",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: { xs: 3, md: 5 },
          borderRadius: "20px",
          width: "100%",
          maxWidth: "480px",
          background: "#FFFFFFDD",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            color="#0D47A1"
          >
            Create Account
          </Typography>
          {showSuccess()}
          {showError()}
          {showForm()}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Signup;
