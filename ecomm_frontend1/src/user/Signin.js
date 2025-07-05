import React from "react";
import TextField from '@mui/material/TextField';
import {Box, Button ,Typography,Paper, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Google, Apple } from '@mui/icons-material';
import { Stack } from "@mui/material";
import  Grid from "@mui/material/Grid2";
import { postApi }   from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authentication } from "../Common/auth/auth"; 
import "../Common/Loader.css"
import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { API } from "../config";
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
    const [openDialog, setOpenDialog] = useState(false);

    const {email,password} = values;

    const handleSubmit = async (event)=>{
        setValues({...values,loading:true});
        event.preventDefault(); 
        const body={ email:email, password:password };
        const result = await postApi('signin',body);
        const res=await result.json(); 
        if(!result.ok){
            setValues({...values,error:res?.error,loading:false})
        }else{
            setValues({...values,error:false,success:true,loading:false})
            authentication(res);
            navigate("/");
        }
    }

    const handleChange = name => event => {
        setValues({...values,error:false,success:false,[name]:event.target.value});
    }

    const showError = () =>{
        return (
            values.error&&<Stack sx={{bgcolor:"red" ,padding:"10px"}}>{values.error}</Stack>
        )
    }

    const showForm = () =>{ 
        return (
            <Box>
            <form>
            <Stack spacing={5}>
                <TextField
                    label="Email"
                    value={email}
                    onChange={handleChange('email')}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handleChange('password')}
                />
                <Button variant="outlined" type="submit" onClick={handleSubmit} color="success">Signin</Button>
                <Stack>Not Registered? <Link to="/Signup">SignUp</Link></Stack>
                <Button variant="contained" color="black" onClick={() => setOpenDialog(true)}>
                    Show Demo Credentials
                </Button>
            </Stack>
            </form>
            </Box>
        )
    }

    const handleSuccess = async (credentialResponse) => {
        const res = await fetch(`${API}api/google-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credentialResponse.credential })
        });
        const data = await res.json();
        if (data.token) {
            setValues({...values,error:false,success:true,loading:false})
            authentication(data);
            navigate("/")
        } else {
            setValues({...values,error:data?.error,loading:false})
        }
    }

    return (
    <Stack
      height="100vh"
      sx={{
        padding: { xs: '20px', md: '60px' },
        background: 'linear-gradient(135deg, #E0F7FA, #FFFFFF)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {values.loading && (
        <div className="loader-overlay">
          <div className="gradient-spinner">
            <div className="gradient-spinner-inner"></div>
          </div>
          <div className="particles-container">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="particle"></div>
            ))}
          </div>
        </div>
      )}

      <Paper
        elevation={6}
        sx={{
          borderRadius: '20px',
          padding: { xs: 3, md: 5 },
          maxWidth: '1050px',
          width: '100%',
          background: '#FFFFFFDD',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Grid container spacing={9} alignItems="center">
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Typography variant="h4" fontWeight="bold" color="#0D47A1">
                Welcome Back!
              </Typography>
              {showError()}
              {showForm()}
              <Typography variant="body2" textAlign="center" color="gray">
                Or continue with
              </Typography>
              <Stack direction="column" spacing={1.5}>
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => console.log('Login Failed')}
                />
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <img
              src={bookBecho}
              alt="Login Illustration"
              style={{
                width: '100%',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                objectFit: 'cover',
                maxHeight: '400px',
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Demo Login Credentials</DialogTitle>
        <DialogContent>
          <Typography variant="body1"><strong>Admin User</strong></Typography>
          <Typography>Email: <code>satyammishra@gmail.com</code></Typography>
          <Typography>Password: <code>satyam@1</code></Typography>
          <Typography variant="body1"><strong>Regular User</strong></Typography>
          <Typography>Email: <code>satyam.myname0702@gmail.com</code></Typography>
          <Typography>Password: <code>Satyam@1('s' is in uppercaseletter)</code></Typography>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
