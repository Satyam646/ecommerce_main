import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Container,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { isAuthenticated, signout } from "../Common/auth/auth";
import { purchaseItem } from "../Common/UserApi/userApi";
import moment from "moment";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { API } from "../config";

export default function UserDashboard() {
    const { user, token } = JSON.parse(isAuthenticated());
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        purchaseItem(user?._id, token).then(data => {
            if (!data?.error) setHistory(data);
        });
    }, [user?._id, token]);

    const Sidebar = () => (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "yellow" }} />
                <Typography variant="h6">Hello, {user?.name || "User"}</Typography>
            </Stack>
            <List>
                <ListItem button onClick={() => navigate("/Cart")}>
                    <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                    <ListItemText primary="Cart" />
                </ListItem>
                <ListItem button onClick={() => navigate(`/profile/${user._id}`)}>
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText primary="Update Profile" />
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
                <Typography><b>Username:</b> {user?.name}</Typography>
                <Typography><b>Email:</b> {user?.email}</Typography>
                <Typography><b>Role:</b> {user?.role === 0 ? "Registered user" : "Admin"}</Typography>
            </Stack>
        </Paper>
    );

    const PurchaseHistory = () => (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Purchase History</Typography>
            {history.length > 0 ? history.map((h, i) => (
                <Box key={i} sx={{ my: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
                    {h.products.map((p, indx) => (
                        <Stack key={indx} spacing={1}>
                            <img src={`${API}product/photo/${p?._id}`} alt={p?.name} style={{ width: "100%", maxWidth: "200px", borderRadius: "8px" }} />
                            <Typography variant="subtitle1">{p?.name}</Typography>
                            <Typography variant="body2">Price: ${p?.price}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Purchased {moment(h?.createdAt).fromNow()}
                            </Typography>
                        </Stack>
                    ))}
                </Box>
            )) : (
                <Typography variant="body2" color="text.secondary">No purchase history available.</Typography>
            )}
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    {Sidebar()}
                </Grid>
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        {UserInfo()}
                        {PurchaseHistory()}
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}
