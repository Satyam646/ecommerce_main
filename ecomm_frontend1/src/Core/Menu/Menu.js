import React from "react"
import {Link, } from 'react-router-dom' // link is used to avoid reloading a page as href relods the page withRouter used to 
import Stack from '@mui/material/Stack';
import "./Menu.css"
import { signout } from "../../Common/auth/auth";
// import { Typography } from "@mui/material";
import { useLocation,useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../Common/auth/auth";



export default function Menu(){
  const navigate = useNavigate();
  //  const jwt=localStorage.getItem("jwt");
    const LinkStyle={
        textDecoration:"none"
    }
    const location=useLocation();
    console.log(location);
    const isActive=(location,path)=>{
           if(location.pathname===path){
            return "white"
           }else{
            return ""
           }
    }
    return (
      <Stack   direction = "row"  spacing={3} sx={{height:"8vh",bgcolor:"blue", padding:"20px 0px 0px 10px" ,boxSizing:"border-box"}}>
       {isAuthenticated()===false&&<Stack sx={{bgcolor:isActive(location,"/signin")}} ><Link to="/signin"   style={LinkStyle}>Signin</Link></Stack>}
       {isAuthenticated()===false&&<Stack sx={{bgcolor:isActive(location,"/signup")}}><Link to="/signup" style={LinkStyle}>Signup</Link></Stack>}
       {<Stack sx={{bgcolor:isActive(location,"/Dashboard")}}><Link to="/Dashboard" style={LinkStyle}>Dashboard</Link></Stack>}
       <Stack sx={{bgcolor:isActive(location,"/")}}><Link to="/" style={LinkStyle}>Home</Link></Stack>
       <Stack sx={{bgcolor:isActive(location,"/shop")}}><Link to="/shop" style={LinkStyle}>Shop</Link></Stack>
       {isAuthenticated()&&<Stack sx={{bgcolor:'red', cursor:"pointer"}}  onClick={()=>{signout(navigate)}}>signout</Stack>}
      </Stack>
    )
}