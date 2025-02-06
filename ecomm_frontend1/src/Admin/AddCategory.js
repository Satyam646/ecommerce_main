
import React from "react"
import TextField from '@mui/material/TextField';
import {Button ,Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { useState } from "react";
import { postAuthApi } from "../api";
import { isAuthenticated } from "../Common/auth/auth";


const AddCategory = ()=>{
    const [values,setValues] = useState({
        name:"",
        error:false,
        success:false,
        loading:false
    })
    // const {name} = values;
    const handleChange = name => event=>{
        setValues({...values,error:false,success:false,[name]:event.target.value});
    }
    console.log("valued",values);
    const handleSubmit= async(e)=>{
        e.preventDefault();
        setValues({...values,loading:true});
        console.log("value",values);
        const userId=localStorage.getItem("userId");
        const body={
          name:values.name
        }
        const token=JSON.parse(isAuthenticated()).token
         const result = await postAuthApi(`category/create/${userId}`,body,token);
      //   console.log(result);  
      const res=await result.json(); 
        if(!result.ok){
          // console.log("err",await result.json());
          setValues({...values,error:res?.error,loading:false})
        }else{
          setValues({...values,error:false,success:true,loading:false})
        }
    }
    const showerror=()=>{
        return(
            values.error&&<Stack sx={{bgcolor:"red",padding:"10px" , boxSizing:"border-box"}}>Category Name should be unique</Stack>
        )
    }
    const showSuccess = () =>{
        return (
            values.success==true&&<Stack sx={{bgcolor:"lightgreen",padding:"10px" , boxSizing:"border-box"}}>Category Created Successfully</Stack>
        )
    }
    const showForm = () =>{
        return(
        <form onSubmit={handleSubmit}>
        <Stack spacing ={3} sx={{padding:"10px"}}>
        {/* <Typography>Email</Typography> */}
         <TextField
         id="outlined-error"
         label="Category Name"
         value={values.name}
         required
         onChange={handleChange('name')}
       />
       {/* <Typography>Password</Typography> */}
       <Stack  sx={{alignSelf:"start"}} spacing={3}>
       <Button variant="outlined" type="submit"  color="success">AddCategory</Button>
       </Stack>
       </Stack>
       </form>
    )}
   return (
    <Stack>
    {showSuccess()}
    {showerror()}
    {showForm()}
    </Stack>
   )
      
}
export default AddCategory;