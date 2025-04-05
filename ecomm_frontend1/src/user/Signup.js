import React from "react";
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import {Button ,Typography } from "@mui/material";
import { Stack,Select,MenuItem,InputLabel,FormControl } from "@mui/material";
import {  postApi}  from "../api";
import { useState } from "react";
const Signup = () => {
    const [values,setValues] = useState({
        name:"",
        email:"",
        password:"",
        error:"",
        success:false,
    });
    const {name,email,password,role} = values;
    const handleSubmit = async (event)=>{
      event.preventDefault(); // prevent reload of page
      const body={
        name:name,
        email:email,
        password:password,
        role:role
      }
      const result = await postApi('signup',body);
      if(!result.ok){
        // console.log("err",await result.json());  
        const res=await result.json();
        setValues({...values,error:res?.error})
      }else{
        setValues({...values,error:false,success:true})
      }
    }
    const handleChange=name=>event=>{
        setValues({...values,error:false,success:false,[name]:event.target.value});
    }
    const showSuccess = () =>{
        return (
       values.success&&<Stack sx={{bgcolor:"lightgreen" ,padding:"20px", boxSizing:"border-box"}} direction="row">User Created successfully <Link to="/signin">Signin</Link></Stack>
        )
    }
    const showError = () =>{
        return (
            values.error&&<Stack sx={{bgcolor:"red" ,padding:"20px", boxSizing:"border-box"}}>{values.error}</Stack>
             )
    }
    const showForm = () =>(
        <form >
        <Stack spacing ={3}>
        {/* <Typography>Name</Typography> */}
        <TextField
         id="outlined-error"
         label="Name"
         value={name}
         onChange={handleChange('name')}
       />
        {/* <Typography>Email</Typography> */}
         <TextField
         id="outlined-error"
         label="Email"
         value={email}
         onChange={handleChange('email')}
       />
       {/* <Typography>Password</Typography> */}
       {/* <TextField
         id="outlined-error"
         label="role"
         value={role}
         onChange={handleChange('role')}
       /> */}
       <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">role</InputLabel>
  <Select
    value={role}
    label="role"
    onChange={handleChange("role")}
  >
    <MenuItem value={1}>Admin</MenuItem>
    <MenuItem value={0}>User</MenuItem>
  </Select>
</FormControl>
       <TextField
         id="outlined-error"
         label="Password"
         type="password"
         value={password}
         onChange={handleChange('password')}
       />
       <Stack  sx={{alignSelf:"start"}} spacing={3}>
       <Button variant="outlined" type="submit" onClick={handleSubmit} color="success">SignUp</Button>
       <Link to="/Signin">Already a user Signin</Link>
       </Stack>
       </Stack>
       </form>
    )
    return (
         <Stack height="70vh" sx={{padding:"20px",boxSizing:"border-box"}} spacing={2}>
        {showSuccess()}
        {showError()}
        {showForm()}
        </Stack>
    )
}
export default Signup