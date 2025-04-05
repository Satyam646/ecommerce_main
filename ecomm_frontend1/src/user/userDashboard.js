import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { isAuthenticated } from "../Common/auth/auth";
import Grid from '@mui/material/Grid2';
import { purchaseItem } from "../Common/UserApi/userApi";
import moment from "moment"
import { useNavigate } from "react-router-dom";
import { Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { signout } from "../Common/auth/auth";
import InventoryIcon from '@mui/icons-material/Inventory';
import FilterFramesIcon from '@mui/icons-material/FilterFrames';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from "@mui/icons-material/Person";
import { API } from "../config";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function UserDashboard() {
    const { user, token } = JSON.parse(isAuthenticated())
    const [history, setHistory] = useState([]);
    const Navigate = useNavigate();
    const LinkStyle = {
        textDecoration: "none"
    }
    //  const userLinks = () => {
    //     return(
    //     <Stack spacing={2} sx={{ border:"2px solid grey",padding:"10px",boxSizing:"border-box",width:"50%" }}>
    //         <Link to="/Cart" style={LinkStyle}>Cart </Link>      
    //         <Link to={`/profile/${user._id}`} style={LinkStyle}>Profile</Link>
    //     </Stack>
    //     )
    //  }
    const Sidebar = () => {
        return (
            <Stack spacing={2} sx={{ width: 300, padding: 2, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
                {/* Profile Section */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: "yellow" }} />
                    <Typography variant="h6">Hello User</Typography>
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
                    <ListItem button onClick={() => { Navigate("/Cart") }}>
                        <ListItemIcon>
                            <ShoppingCartIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cart" sx={{}} />
                    </ListItem>
                    <ListItem button onClick={() => { Navigate(`/profile/${user._id}`) }}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Update Profile" sx={{}} />
                    </ListItem>
                    {/* <ListItem button onClick={() => { Navigate("/admin/orders") }}>
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
                    </ListItem> */}
                    <ListItem button onClick={() => { signout(Navigate) }} >
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
    //  const userInfo = () =>{
    //     return (
    //         <Stack sx={{border:"2px solid grey", width:"50%"}}><Typography variant="h4"> User Information </Typography>
    //         <Typography> {user?.name} </Typography>
    //         <Typography> {user?.email}</Typography>
    //         <Typography> {user?.role==0?"Registered user":"admin user"}  </Typography>
    //         </Stack>
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
                    <Typography variant="body2">Registered user</Typography>
                </Stack>
            </Stack>
        );
    };

    const orderItems = (userId, token) => {
        purchaseItem(userId, token).then(data => {

            if (data?.error) {
                //   setValues({...values,error:data.error});
                console.log("error");
            }
            //   else if(typeof data === 'object'){
            //     console.log("history",data);
            //     //   setHistory(data);
            //   }
            else {
                setHistory(data);
            }
        })

    }
    //  const PurchaseHistory = (history) =>{
    //     console.log(history,"jjk");
    //     return (
    //         <Stack sx={{border:"2px solid grey", width:"50%"}}><Typography variant="h4"> Purchase History </Typography>
    //         {history?.map((h,i)=>{
    //             return(
    //                 <Stack>
    //                     <hr></hr>
    //                     {h?.products.map((p,indx)=>{
    //                     return(
    //                       <Stack>
    //                       <Typography>Product Name: {p?.name} </Typography>
    //                       <Typography>Product price:${p?.price}</Typography>
    //                       <Typography>Purchased Date:{moment(h?.createdAt).fromNow()}</Typography>
    //                       </Stack>
    //                     )
    //                     })}
    //                     <hr></hr>
    //                 </Stack>
    //             )
    //         })}
    //         </Stack>   
    //     )

    //  }
    const PurchaseHistory = () => {
        return (
            <Stack sx={{ border: "2px solid grey", width: "50%", p: 2, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Purchase History
                </Typography>
                {history.length > 0 ? (
                    history.map((h, i) => (
                        <Stack key={i} spacing={2} sx={{ p: 2, border: "1px solid lightgrey", borderRadius: 1 }}>
                            <Divider />
                            {h?.products?.map((p, indx) => (
                                <Stack key={indx} spacing={1}>
                                    <img src={`${API}product/photo/${p?._id}`} alt={p?.name} height="200px" width="200px"/>
                                    <Typography variant="h6">Product Name: {p?.name}</Typography>
                                    <Typography>Price: ${p?.price}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Purchased {moment(h?.createdAt).fromNow()}
                                    </Typography>
                                </Stack>
                            ))}
                            <Divider />
                        </Stack>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No purchase history available.
                    </Typography>
                )}
            </Stack>
        );
    };
    //  const purchaseHistory = (history) => {
    //     return(
    //     <Stack>
    //     <Typography variant="h4"> Purchase history </Typography>
    //     <Typography> orders </Typography>
    //     </Stack>
    //     )
    //  }
    useEffect(() => {
        orderItems(user?._id, token);
    }, [])
    return (
        <Stack spacing={1} sx={{ padding: "10px", boxSizing: "border-box" }}>
            <Grid container spacing={0}>
                <Grid size={3}>
                    {Sidebar()}
                </Grid>
                <Grid size={9}>
                    <Stack spacing={2}>
                        {UserInfo()}
                        {PurchaseHistory(history)}
                    </Stack>
                </Grid>
            </Grid>
        </Stack>
    )
}