import React from "react";
import TextField from '@mui/material/TextField';
import {Box, Button ,Typography } from "@mui/material";
import { Stack } from "@mui/material";
import  Grid from "@mui/material/Grid2";
import { postApi }   from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authentication } from "../Common/auth/auth"; 
import "../Common/Loader.css"
import { Link } from "react-router-dom";
// import {bookBecho} from "../image/bookBecho.png"
import bookBecho from "../Image/BookBecho.png"
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
    const showForm = () =>{ 
          return (
           <Box>
            <form >
            <Stack spacing={5} >
            <TextField
         id="outlined-error"
         label="Email"
         value={email}
         onChange={handleChange('email')}
       />
       <TextField
         id="outlined-error"
         label="Password"
         type="password"
         value={password}
         onChange={handleChange('password')}
       />
       {/* </Stack> */}
       {/* <Stack  sx={{alignSelf:"start"}}> */}
       <Button variant="outlined" type="submit" onClick={handleSubmit} color="success">Signin</Button>
       <Stack>Not Registered with us  <Link to="/Signup">SignIn</Link> </Stack>
        {/* <Typography>Email</Typography> */}
        
       {/* <Typography>Password</Typography> */}
       </Stack>
       </form>
       </Box>
    )
  }
    return (
         <Stack height="70vh"sx={{padding:"50px" ,bgcolor:"#CAFBFF"}} spacing={2}>
         {values.loading&&(<Stack className="loading">Loading</Stack>)}
        
        
        <Grid container spacing={2} alignItems="center">
            <Grid size={6} > 
              <Stack spacing={1}>
            {showError()}
            {showForm()}
            </Stack>
       
       
       </Grid>
        <Grid size={6}>
              <img src={bookBecho} alt="/" height="400px" width="100%" /> 
        </Grid>
          </Grid>
        </Stack>
    )
}
