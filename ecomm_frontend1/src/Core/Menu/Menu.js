import React from "react"
import {Link, } from 'react-router-dom' // link is used to avoid reloading a page as href relods the page withRouter used to 
import Stack from '@mui/material/Stack';
import "./Menu.css"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import { signout } from "../../Common/auth/auth";
// import { Typography } from "@mui/material";
import bookBecho  from "../../Image/BookBecho.png"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLocation,useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../Common/auth/auth";
import { itemTotal } from "../Cart/AddItem";
import { Typography } from "@mui/material";
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
      <Stack   direction="row"  alignItems="center"  justifyContent="space-between" sx={{height:"8vh",bgcolor:"#333B6A", padding:"20px 20px 0px 10px",boxSizing:"border-box" }}>
        <Stack direction="row" spacing={5} alignItems="center">
        <Stack>
        <img src={bookBecho} alt="/" height="40px" width="90px" />
        </Stack>
       {/* {isAuthenticated()===false&&<Stack sx={{bgcolor:isActive(location,"/signin")}} ><Link to="/signin"   style={LinkStyle}>Signin</Link></Stack>}
       {isAuthenticated()===false&&<Stack sx={{bgcolor:isActive(location,"/signup")}}><Link to="/signup" style={LinkStyle}>Signup</Link></Stack>}
       {<Stack sx={{bgcolor:isActive(location,"/Dashboard")}}><Link to="/Dashboard" style={LinkStyle}>Dashboard</Link></Stack>} */}
       <Stack direction="row" spacing={3}>
       <Stack><Link to="/" style={LinkStyle}><Typography sx={{borderBottom:isActive(location,"/")?`2px solid ${isActive(location,"/")}`:"",color:isActive(location,"/")}}>Home</Typography></Link></Stack>
       <Stack><Link to="/shop" style={LinkStyle} ><Typography sx={{borderBottom:isActive(location,"/shop")?`2px solid ${isActive(location,"/shop")}`:"",color:isActive(location,"/shop")}}>Shop</Typography></Link></Stack>
       </Stack>
       </Stack>
       <Stack direction ="row" spacing={2} alignItems="center">
       <Stack ><Link to="/Cart" style={LinkStyle}><ShoppingCartIcon sx={{borderBottom:isActive(location,"/Cart")?`2px solid ${isActive(location,"/Cart")}`:"",color:isActive(location,"/Cart")}}/><sup>{itemTotal()}</sup></Link></Stack>
       <Stack ><Link to="/Dashboard" style={LinkStyle}><AccountCircleIcon sx={{color:isActive(location,"/Dashboard")}}/></Link></Stack>
       {/* {isAuthenticated()&&<Stack sx={{bgcolor:'red', cursor:"pointer"}}  onClick={()=>{signout(navigate)}}>signout</Stack>} //will be on user page */}
       </Stack>
      </Stack>
    )
}