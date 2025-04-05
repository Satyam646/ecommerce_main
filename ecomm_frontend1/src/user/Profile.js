import { Button, Stack } from "@mui/material";
import React, { useEffect,useState } from "react";
import { read, update,updatedUser } from "../Common/UserApi/userApi";
import {TextField,} from "@mui/material";
import { isAuthenticated } from "../Common/auth/auth";
import { useMatch } from "react-router-dom";


export default function Profile(){
    // these field we can update.
    const match = useMatch("/profile/:id");
    const [values,setValues] = useState({
        name:"",
        email:"",
        password:"",
        error:"",
        success:false,
    })
    const {token} = JSON.parse(isAuthenticated());
    const {name,email,password,error,success}=values;
    const init = (userId) =>{
        read(userId,token).then(data=>{
            if(data?.error){
                setValues({...values,error:data.error});
            }else{
                setValues({...values,name:data?.name,email:data?.email,password:data?.password})
            }
        })

    }
    const handleSubmit = (event) =>{
        console.log(match,token,"hello");
        event.preventDefault();
        update(match.params.id,token,{name,email,password}).then(data=>{
            if(data?.error){
                console.log(data?.error);
            }else{
                updatedUser(data,()=>{
                setValues({
                    ...values,
                    name:data?.name,
                    email:data?.email,
                    password:data?.password,
                    success:true,
                })
               })
            }
        })
    }
    const handleChange = name=>event=>{
      setValues({...values,error:false,success:false,[name]:event.target.value});
    }
  
    
    useEffect(()=>{
        init(match.params.id);
    },[]);
    const ProfileUpdate =(name,email,password)=>{
        return(
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    
                      label="Name"
                      value={name}
             
                      onChange={handleChange('name')}
                    />
                       <TextField
                             label="email"
                             value={email}
                    
                             onChange={handleChange('email')}
                           />
                              <TextField
                                    label="Password"
                                    type ="password"
                                    value={password}
                                    onChange={handleChange("password")}
                                  />
                                  <Button type="submit" variant="contained" sx={{alignSelf:"start"}}>Submit</Button>
                
            </Stack>
        </form>
        )
    }
    return(
        <Stack height="70vh">
           {values.success==true&&<Stack height="5vh" sx={{bgcolor:"lightgreen" ,padding:"4px", boxSizing:"border-box"}}>Profile Updated successfully!!</Stack>}
            <h2>Update Profile</h2>
            {ProfileUpdate(name,email,password)}
        </Stack>
    )
}