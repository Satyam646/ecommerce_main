import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Container, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from '@mui/icons-material/Inventory';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { signout, isAuthenticated } from "../Common/auth/auth";

export default function AdminDashboard() {
    const { user } = JSON.parse(isAuthenticated());
    const navigate = useNavigate();

    const Sidebar = () => (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "yellow" }} />
                <Typography variant="h6">Hello Admin</Typography>
            </Stack>
            <List>
                <ListItem button onClick={() => navigate("/admin/AddCategory")}>
                    <ListItemIcon><InventoryIcon /></ListItemIcon>
                    <ListItemText primary="Create Category" />
                </ListItem>
                <ListItem button onClick={() => navigate(`/profile/${user._id}`)}>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Update Profile" />
                </ListItem>
                <ListItem button onClick={() => navigate('/admin/AddProduct')}>
                    <ListItemIcon><InventoryIcon /></ListItemIcon>
                    <ListItemText primary="Create Product" />
                </ListItem>
                <ListItem button onClick={() => navigate("/admin/orders")}>
                    <ListItemIcon><FilterFramesIcon /></ListItemIcon>
                    <ListItemText primary="View Orders" />
                </ListItem>
                <ListItem button onClick={() => navigate("/admin/ManageProducts")}>
                    <ListItemIcon><ManageHistoryIcon /></ListItemIcon>
                    <ListItemText primary="Update Products" />
                </ListItem>
                <ListItem button onClick={() => signout(navigate)}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText primary="Sign Out" />
                </ListItem>
            </List>
        </Paper>
    );

    const UserInfo = () => (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "blue" }} />
                    <Typography variant="h6">User Information</Typography>
                </Stack>
                <Stack spacing={1}>
                    <Typography variant="body1" fontWeight="bold">Username:</Typography>
                    <Typography variant="body2">{user?.name}</Typography>
                </Stack>
                <Stack spacing={1}>
                    <Typography variant="body1" fontWeight="bold">Email:</Typography>
                    <Typography variant="body2">{user?.email}</Typography>
                </Stack>
                <Stack spacing={1}>
                    <Typography variant="body1" fontWeight="bold">Role:</Typography>
                    <Typography variant="body2">Admin User</Typography>
                </Stack>
            </Stack>
        </Paper>
    );

    return (
        <Box sx={{ bgcolor: "#f1f3f6", py: 4, minHeight: "100vh" }}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        {Sidebar()}
                    </Grid>
                    <Grid item xs={12} md={8}>
                        {UserInfo()}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
