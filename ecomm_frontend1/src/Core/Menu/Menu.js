import React from "react"
import {Link, } from 'react-router-dom' // link is used to avoid reloading a page as href relods the page withRouter used to 
import Stack from '@mui/material/Stack';
import "./Menu.css"
// import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
export default function Menu(){
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
       <Stack sx={{bgcolor:isActive(location,"/signin")}} ><Link to="/signin"   style={LinkStyle} > Signin</Link></Stack>
       <Stack sx={{bgcolor:isActive(location,"/signup")}}><Link to="/signup" style={LinkStyle}> Signup</Link></Stack>
       <Stack sx={{bgcolor:isActive(location,"/")}}><Link to="/" style={LinkStyle}> Home</Link></Stack>
      </Stack>
    )
}