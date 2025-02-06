import React from "react";
import TextField from '@mui/material/TextField';
import {Button ,Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { postApi }   from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authentication } from "../Common/auth/auth"; 
import "../Common/Loader.css"
export default function Signin(){
    const navigate=useNavigate();
    const [values,setValues] = useState({
        email:"",
        password:"",
        error:"",
        success:false,
        loading:false,
    });
    const {email,password} = values;
    const handleSubmit = async (event)=>{
        setValues({...values,loading:true});
      event.preventDefault(); // prevent reload of page
      const body={
        email:email,
        password:password
      }
       const result = await postApi('signin',body);
    //   console.log(result);  
    const res=await result.json(); 
      if(!result.ok){
        // console.log("err",await result.json());
         
        setValues({...values,error:res?.error,loading:false})
      }else{
        setValues({...values,error:false,success:true,loading:false})
        authentication(res);
        navigate("/");
      }
    //   setValues({...values,loading:false});
    }
    const handleChange=name=>event=>{
        setValues({...values,error:false,success:false,[name]:event.target.value});
    }
    const showError = () =>{
        return (
            values.error&&<Stack sx={{bgcolor:"red" ,padding:"20px", boxSizing:"border-box"}}>{values.error}</Stack>
             )
    }
    const showForm = () =>(
        <form >
        <Stack spacing ={3}>
        {/* <Typography>Email</Typography> */}
         <TextField
         id="outlined-error"
         label="Email"
         value={email}
         onChange={handleChange('email')}
       />
       {/* <Typography>Password</Typography> */}
       <TextField
         id="outlined-error"
         label="Password"
         type="password"
         value={password}
         onChange={handleChange('password')}
       />
       <Stack  sx={{alignSelf:"start"}} spacing={3}>
       <Button variant="outlined" type="submit" onClick={handleSubmit} color="success">Signin</Button>
       </Stack>
       </Stack>
       </form>
    )
    return (
        
         <Stack sx={{padding:"150px", boxSizing:"border-box"}} spacing={2}>
         {values.loading&&(<Stack className="loading">Loading</Stack>)}
        {showError()}
        {showForm()}
        </Stack>
    )
}
