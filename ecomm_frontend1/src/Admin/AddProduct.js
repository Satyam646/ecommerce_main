import React, { useEffect } from "react"
import TextField from '@mui/material/TextField';
import {Button ,Typography,Input } from "@mui/material";
import { Stack ,MenuItem,Select,InputLabel,FormControl} from "@mui/material";
import { useState } from "react";
import { postAuthApi } from "../api";
import { isAuthenticated } from "../Common/auth/auth";
import { postFormData } from "../api";
import { getApi } from "../api";



export default function AddProduct(){
    const { user,token } = isAuthenticated();
    const [values,setValues] = useState({
        name:"",
        description:"",
        price:"",
        categories:[],
        category:"",
        shipping:"",
        quantity:"",
        photo:"",
        loading:false,
        error:"",
        createdProduct:"",
        redirectToProfile:false,
        formData:new FormData(),
    })

    const {  name,
        description,
        price,
        categories,
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData
    }=values;
        
       
        const getCategories =()=>{
            getApi("category").then(data=>{
                if(data?.error){
                   setValues({...values,error:data?.error});
                }else{
                    setValues({...values,categories:data?.category});
                }
            })
        }
        
       useEffect(()=>{
            // setValues({...values,formData : new FormData()});
            getCategories();
           
       },[])
       console.log(values?.categories);
       const handleChange = (name)=>(event)=> {
        // console.log("file",event.target.files[0]);
          const value = name=='photo'? event.target?.files[0]:event.target.value;
          formData.set(name,value);
         setValues({...values,error:false,success:false,[name]:value});
       }
          const handleSubmit= async(e)=>{
         
            console.log("hello",e);
                  e.preventDefault();
                  for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                  }
                  setValues({...values,loading:true});
                  console.log("value",formData);
                  const userId=localStorage.getItem("userId");
               
                  const token=JSON.parse(isAuthenticated()).token
                   const result = await postFormData(`product/create/${userId}`,formData,token);
                //   console.log(result);  
                const res=await result.json(); 
                  if(!result.ok){
                    // console.log("err",await result.json());
                    setValues({...values,error:res?.error,loading:false})
                  }else{
                    setValues({...values,error:false,success:true,loading:false,createdProduct:res.name})
                  }
              }
     
       const showerror=()=>{
               return(
                   values.error&&<Stack sx={{bgcolor:"red",padding:"10px" , boxSizing:"border-box"}}>{values.error}</Stack>
               )
           }
       const showSuccess = () =>{
                   return (
                       values.success==true&&<Stack sx={{bgcolor:"lightgreen",padding:"10px" , boxSizing:"border-box"}}>{createdProduct} Created Successfully</Stack>
                   )
               }
       const showForm = () =>{
          return(
          <form  onSubmit={handleSubmit}>
          <Stack spacing ={3} sx={{padding:"10px"}}>
          {/* <Typography>Email</Typography> */}
            <Stack>
             <Typography>Add Photo</Typography>
            <label>
            <input type="file" name="photo" accept="image/*" onChange={handleChange("photo")}/>
            </label>
            </Stack>
         <TextField
           id="outlined-error"
           label="Product Name"
           value={name}
           required
           onChange={handleChange('name')}
         />
         <Input  multiline  onChange={handleChange("description")}  placeholder="Add Product Description..." />
         <TextField
           id="outlined-error"
           label="price"
           value={price}
           required
           onChange={handleChange('price')}
         />
           <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Category</InputLabel>
      <Select
       value={category}
       label="category"
       onChange={handleChange("category")}
     >
       {categories?.map((data,indx)=>
        (<MenuItem key={indx} value={data?._id}>{data?.name}</MenuItem>)
       )}
       </Select>
    </FormControl>
         <TextField
           id="outlined-error"
           type="number"
           label="quantity"
           value={quantity}
           required
           onChange={handleChange('quantity')}
         />
         <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Shipping</InputLabel>
      <Select
       value={shipping}
       label="shipping"
       onChange={handleChange("shipping")}
     >
       <MenuItem value={1}>Yes</MenuItem>
      <MenuItem value={0}>No</MenuItem>
      </Select>
    </FormControl>
         {/* <Typography>Password</Typography> */}
         <Stack  sx={{alignSelf:"start"}} spacing={3}>
         <Button variant="outlined" type="submit" color="success">Create Product</Button>
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