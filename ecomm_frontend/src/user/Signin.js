import React, { useState } from "react";
import {
  Box, Button, Typography, Paper, Dialog, DialogTitle, DialogContent,
  Stack, TextField
} from "@mui/material";
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from "react-router-dom";
import { postApi } from "../api";
import { authentication } from "../Common/auth/auth";
import bookBecho from "../Image/BookBecho.png";
import "../Common/Loader.css";
import { API } from "../config";
export default function Signin() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    success: false,
    loading: false,
  });

  const { email, password } = values;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });
    const result = await postApi('signin', { email, password });
    const res = await result.json();
    if (!result.ok) {
      setValues({ ...values, error: res?.error, loading: false });
    } else {
      setValues({ ...values, error: false, success: true, loading: false });
      authentication(res);
      navigate("/");
    }
  };

  const handleChange = name => event => {
    setValues({ ...values, error: false, success: false, [name]: event.target.value });
  };

  const handleSuccess = async (credentialResponse) => {
    const res = await fetch(`${API}api/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credentialResponse.credential })
    });
    const data = await res.json();
    if (data.token) {
      setValues({ ...values, error: false, success: true, loading: false });
      authentication(data);
      navigate("/");
    } else {
      setValues({ ...values, error: data?.error, loading: false });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #e6f0ff, #ffffff)",
        px: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          width: "100%",
          maxWidth: 420,
          p: 4,
          backgroundColor: "#fff",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <img src={bookBecho} alt="BookMart Logo" style={{ width: 70 }} />
          <Typography variant="h5" fontWeight="bold" color="primary">
            BookMart
          </Typography>
          <Typography variant="h6" fontWeight={600}>
            Login
          </Typography>

          {values.error && (
            <Typography color="error" textAlign="center">
              {values.error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Email address"
            variant="outlined"
            value={email}
            onChange={handleChange("email")}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={handleChange("password")}
          />

          <Box width="100%" display="flex" justifyContent="space-between">
            <Typography variant="body2">
              Not Registered? <Link to="/Signup">Sign up</Link>
            </Typography>
            <Link to="/forgot-password" style={{ fontSize: "14px" }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ borderRadius: "10px", mt: 1 }}
            onClick={handleSubmit}
          >
            Log in
          </Button>

          <Typography variant="body2" color="text.secondary">
            Or continue with
          </Typography>

          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Google login failed")}
          />

          <Button
            variant="text"
            onClick={() => setOpenDialog(true)}
            sx={{ fontSize: "0.9rem", textTransform: "none" }}
          >
            Show Demo Credentials
          </Button>
        </Stack>
      </Paper>

      {/* Demo Credentials Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Demo Login Credentials</DialogTitle>
        <DialogContent>
          <Typography variant="body1"><strong>Admin User</strong></Typography>
          <Typography>Email: <code>satyammishra@gmail.com</code></Typography>
          <Typography>Password: <code>Satyam@1</code></Typography>
          <Typography variant="body1"><strong>Regular User</strong></Typography>
          <Typography>Email: <code>satyam.myname0702@gmail.com</code></Typography>
          <Typography>Password: <code>Satyam@1</code></Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
