import React, { useEffect, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Container,
  Alert,
  Paper
} from "@mui/material";
import { useMatch } from "react-router-dom";
import { read, update, updatedUser } from "../Common/UserApi/userApi";
import { isAuthenticated } from "../Common/auth/auth";

export default function Profile() {
  const match = useMatch("/profile/:id");
  const { token } = JSON.parse(isAuthenticated());

  const [values, setValues] = useState({
    name: "", email: "", password: "", error: "", success: false,
  });
  const { name, email, password, success } = values;

  useEffect(() => {
    const init = async (userId) => {
      const data = await read(userId, token);
      if (data?.error) {
        setValues(prev => ({ ...prev, error: data.error }));
      } else {
        setValues(prev => ({
          ...prev,
          name: data?.name || "",
          email: data?.email || "",
          password: data?.password || "",
        }));
      }
    };
    init(match.params.id);
  }, [match.params.id, token]);

  const handleChange = (field) => (e) => {
    setValues(prev => ({
      ...prev,
      [field]: e.target.value,
      error: "",
      success: false,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await update(match.params.id, token, { name, email, password });
    if (data?.error) {
      console.log(data.error);
    } else {
      updatedUser(data, () => {
        setValues(prev => ({
          ...prev,
          name: data?.name,
          email: data?.email,
          password: data?.password,
          success: true,
        }));
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight="bold" textAlign="center">
            Update Profile
          </Typography>

          {success && <Alert severity="success">Profile updated successfully!</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                variant="outlined"
                value={name}
                onChange={handleChange("name")}
                fullWidth
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleChange("email")}
                fullWidth
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={handleChange("password")}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Save Changes
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
