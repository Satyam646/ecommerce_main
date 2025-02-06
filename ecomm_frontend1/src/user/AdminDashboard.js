import React from "react";
import { Link } from "react-router-dom";
import { Grid2, Stack, Typography} from "@mui/material";
import { isAuthenticated } from "../Common/auth/auth";
import Grid from '@mui/material/Grid';


export default function AdminDashboard(){

    const {user} = JSON.parse(isAuthenticated());
    const LinkStyle ={
        textDecoration:"none"
    }
     const adminLinks = () => {
        return(
        <Stack spacing={2} sx={{ border:"2px solid grey",padding:"10px",boxSizing:"border-box",width:"50%" }}>
            <Link to="/admin/AddCategory" style={LinkStyle}>Create Category</Link>      
            <Link to='/admin/AddProduct' style={LinkStyle}>Create Product</Link>
      
        </Stack>
        )
     }
     const adminInfo = () =>{
        return (
            <Stack sx={{border:"2px solid grey", width:"50%"}}><Typography variant="h4"> User Information </Typography>
            <Typography> {user?.name} </Typography>
            <Typography> {user?.email}</Typography>
            <Typography> {user?.role==0?"Registered user":"admin user"} </Typography>
            </Stack>
        )
     }
     const purchaseHistory = () => {
        return(
        <Stack>
        <Typography variant="h4"> Purchase history </Typography>
        <Typography> orders </Typography>
        </Stack>
        )
     }
    return (
        <Stack spacing={3} sx={{padding:"10px", boxSizing:"border-box"}}>
            <Grid container spacing={0}> 
                <Grid md={4} >
                {adminLinks()}
                </Grid>
                <Grid md={8} >
                {adminInfo()}
                </Grid>
            </Grid>
             
        </Stack>
    )
}