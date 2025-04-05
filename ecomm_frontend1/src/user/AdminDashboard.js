import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid2, } from "@mui/material";
import { isAuthenticated } from "../Common/auth/auth";
import Grid from '@mui/material/Grid2';
import { getApiAuth } from "../api"
import { useNavigate } from "react-router-dom";
import { Stack, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InventoryIcon from '@mui/icons-material/Inventory';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { signout } from "../Common/auth/auth";


export default function AdminDashboard() {
    const { user } = JSON.parse(isAuthenticated());
    const LinkStyle = {
        textDecoration: "none"
    }

    const Navigate = useNavigate()
    const Sidebar = () => {
        return (
            <Stack spacing={2} sx={{ width: 300, padding: 2, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
                {/* Profile Section */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "yellow" }} />
                    <Typography variant="h6">Hello Admin</Typography>
                </Stack>

                {/* Navigation */}
                <List>
                    {/* <ListItem button>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="MY ORDERS" />
        </ListItem> */}

                    {/* <Typography variant="body2" sx={{ fontWeight: "bold", paddingLeft: 2, paddingTop: 1 }}>ACCOUNT SETTINGS</Typography> */}
                    <ListItem button onClick={() => { Navigate("/admin/AddCategory") }}>
                        <ListItemIcon>
                        <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create Category" sx={{}} />
                    </ListItem>
                    <ListItem button onClick={() => { Navigate(`/profile/${user._id}`) }}>
                        <ListItemIcon>
                         
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Update Profile" sx={{}} />
                    </ListItem>
                    <ListItem button onClick={() => { Navigate('/admin/AddProduct') }}>
                        <ListItemIcon>
                            <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create Product" sx={{}} />
                    </ListItem>
                    <ListItem button onClick={() => { Navigate("/admin/orders") }}>
                        <ListItemIcon>
                            <FilterFramesIcon />
                        </ListItemIcon>
                        <ListItemText primary="View Orders" sx={{}} />
                    </ListItem>
                    <ListItem button onClick={() => { Navigate("/admin/ManageProducts") }}>
                        <ListItemIcon>
                            <ManageHistoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Orders" sx={{}} />
                    </ListItem>
                    <ListItem button onClick={()=>{signout(Navigate)}} >
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="SignOut" sx={{}} />
                    </ListItem>

                    {/* <Typography variant="body2" sx={{ fontWeight: "bold", paddingLeft: 2, paddingTop: 1 }}>PAYMENTS</Typography>
        <ListItem button>
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          <ListItemText primary="Gift Cards" secondary="₹0" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Saved UPI" sx={{ paddingLeft: 4 }} />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Saved Cards" sx={{ paddingLeft: 4 }} />
        </ListItem> */}
                </List>
            </Stack>
        );
    };
    //  const adminLinks = () => {
    //     return(
    //     <Stack spacing={2} sx={{ border:"2px solid grey",padding:"10px",boxSizing:"border-box",width:"50%" }}>
    //         <Link to="/admin/AddCategory" style={LinkStyle}>Create Category</Link>      
    //         <Link to='/admin/AddProduct' style={LinkStyle}>Create Product</Link>
    //         <Link to="/admin/orders" style={LinkStyle}>View Order</Link> 
    //         <Link to="/admin/ManageProducts" style={LinkStyle}>Manageproduct</Link> 
    //     </Stack>
    //     )
    //  }
    const UserInfo = () => {
        return (
            <Stack spacing={2} sx={{ padding: 3, boxShadow: 3, borderRadius: 2, margin: "auto", bgcolor: "white" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "blue" }} />
                    <Typography variant="h6">User Information</Typography>
                </Stack>

                <Stack spacing={1}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>Username:</Typography>
                    <Typography variant="body2">{user?.name}</Typography>
                </Stack>

                <Stack spacing={1}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>Email:</Typography>
                    <Typography variant="body2">{user?.email}</Typography>
                </Stack>

                <Stack spacing={1}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>Role:</Typography>
                    <Typography variant="body2">Admin User</Typography>
                </Stack>
            </Stack>
        );
    };
    //  const adminInfo = () =>{
    //     return (
    //         <Stack sx={{border:"2px solid grey", width:"50%"}}><Typography variant="h4"> User Information </Typography>
    //         <Typography> {user?.name} </Typography>
    //         <Typography> {user?.email}</Typography>
    //         <Typography> {user?.role==0?"Registered user":"admin user"} </Typography>
    //         </Stack>
    //     )
    //  }

    //  const purchaseHistory = () => {
    //     return(
    //     <Stack>
    //     <Typography variant="h4"> Purchase history </Typography>
    //     <Typography> orders </Typography>
    //     </Stack>
    //     )
    //  }
    const profileView = () => {
        return (
            <Stack sx={{ height: "50px", width: "200px", padding: "5px", boxSizing: "border-box", bgcolor: "white" }} direction="row" alignItems="center" spacing={2}>
                <Stack sx={{ bgcolor: "green", borderRadius: "20px", height: "30px", width: "30px" }}></Stack>
                <Typography> Your Profile </Typography>
            </Stack>
        )
    }
    return (
        <Stack spacing={0} height="70vh" sx={{ padding: "10px", boxSizing: "border-box", bgcolor: "#f1f3f6" }}>
            <Grid container spacing={0}>
                <Grid size={3} >
                    {Sidebar()}
                </Grid>
                <Grid size={9} >
                    {UserInfo()}
                </Grid>
            </Grid>
        </Stack>
    )
}