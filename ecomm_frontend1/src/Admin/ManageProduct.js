import React, { useEffect } from "react"
import TextField from '@mui/material/TextField';
import {Button ,Typography,Input,  } from "@mui/material";
import { Stack ,MenuItem,Select,InputLabel,FormControl,Card,CardContent,Avatar} from "@mui/material";
import { useState } from "react";
import { postAuthApi } from "../api";
import { isAuthenticated } from "../Common/auth/auth";
import { postFormData } from "../api";
import { getApi } from "../api";
import { getAllProducts } from "./Adminapi";
import { DeleteProduct } from "./Adminapi";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { API } from "../config";



export default function ManageProducts(){
    const [products,setProducts] = useState([]);
    const {user,token} = JSON.parse(isAuthenticated());
    const navigate = useNavigate();
    const loadProducts = ()=>{
        getAllProducts().then(data=>{
            if(data?.error){
                console.log(data?.error);
            }else{

                setProducts(data?.product);
            }
        })
    }
    const removeProduct = (ProductId,userId,tokenId) =>{
        DeleteProduct(ProductId,userId,tokenId).then(data=>{
            if(data?.error){
                console.log(data?.error);
            }else{
                console.log("Product Deleted Succesfully")
                loadProducts();
            }
        })
    }
    // const showList = () =>{
    //     return (
    //         <Stack>
    //     {
    //      products?.map((p,i)=> <Grid container spacing={1} direction="row">
    //      <Grid size={4}>{p?.name}</Grid>
    //      <Grid size={4}><Button variant="contained" onClick={()=>{Navigate(`/admin/product/update/${p?._id}`)}}>Update</Button></Grid>
    //      <Grid size={4}><Button variant="contained"  onClick={()=>{removeProduct(p?._id,user?._id,token)}}>Delete</Button></Grid>
    //   </Grid>)
        
    //      }
    //     </Stack>
    //     )
    // }
    // const showList = () => (
    //     <Stack spacing={2} sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
    //       {products?.map((p) => (
    //         <Card key={p?._id} sx={{ border: "1px solid gray", borderRadius: 2, boxShadow: 2, padding: 2 }}>
    //           <CardContent>
    //             <Grid container spacing={2} alignItems="center">
    //               <Grid item xs={4}>
    //                 <Typography variant="h6" fontWeight="bold">{p?.name}</Typography>
    //               </Grid>
    //               <Grid item xs={4}>
    //                 <Button variant="contained" color="primary" fullWidth onClick={() => navigate(`/admin/product/update/${p?._id}`)}>
    //                   Update
    //                 </Button>
    //               </Grid>
    //               <Grid item xs={4}>
    //                 <Button variant="contained" color="secondary" fullWidth onClick={() => removeProduct(p?._id, user?._id, token)}>
    //                   Delete
    //                 </Button>
    //               </Grid>
    //             </Grid>
    //           </CardContent>
    //         </Card>
    //       ))}
    //     </Stack>
    //   );
    const showList = () => (
        <Stack spacing={2} sx={{ maxWidth: 800, margin: "auto", padding: 2 }}>
          {products?.map((p, i) => (
            <Card key={p?._id} sx={{ border: "1px solid gray", borderRadius: 2, boxShadow: 2, padding: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <img src={`${API}product/photo/${p?._id}`} alt={p?.name} sx={{ width: "200px", height: "200px" }} />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h6" fontWeight="bold">{p?.name}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => navigate(`/admin/product/update/${p?._id}`)}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="contained" color="error" fullWidth onClick={() => removeProduct(p?._id, user?._id, token)}>
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Stack>
      );
      
    useEffect(()=>{
        loadProducts();
    },[])
    return (
        <Stack>
            <Stack>
            <h2 style={{alignSelf:"center"}}>Total {products?.length} Products</h2>
            </Stack>
            <Stack>
                <Stack >
            {showList()}
            </Stack> 
            </Stack>
        </Stack>
    )
}