import react,{useState,useEffect} from "react"
import { Button, Stack, Typography } from "@mui/material"
import { getApi } from "../../api"
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid2"
import { API } from "../../config";
import Card from "../Home/Cards"
import { AddItem } from "../Cart/AddItem";
import { useContext } from 'react';
import Alert from '@mui/material/Alert';
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';

export default function SingleProduct(){
    const { SnackBar, toggleSnackBar } = useContext(ThemeContext)
    const currentLocation = useLocation().pathname.split("/")[2];
    console.log("currentlocation",currentLocation);
    const [values,setValues] = useState({
        error:"",
        product:{},
    });
    const [relatedProduct,setRelatedProduct] = useState([]);

    const getProduct = ()=>{      
        getApi(`product/${currentLocation}`).then(data=>{
            if(data?.error){
               setValues({...values,error:data?.error});
            }else{
                setValues({...values,product:data});
            }
        })
    }
    const path=`${API}product/photo/${values?.product?._id}`;
    const listRelatedProduct = ()=>{
        getApi(`product/related/${currentLocation}`).then(data=>{
            if(data?.error){
               setValues({...values,error:data?.error});
            }else{
                setRelatedProduct(data);
            }
        })
     }
     const showRelatedProduct=()=>{
        return(
      <Stack>
        <Grid container spacing={1}>
       
        {relatedProduct.map((product)=>  <Grid size={4}><Stack sx={{padding:"10px 30px 30px 0px"}}><Card product={product}/></Stack></Grid>)}
       
        </Grid> 
      </Stack>
        )
     }
      const showSnackBar = () => {
             return (
                 <Snackbar
                     anchorOrigin={{ vertical: 'top', horizontal: "right" }}
                     autoHideDuration={3000}
                     open={SnackBar?.open}
                     // message={SnackBar.message}
                     onClose={() => { toggleSnackBar(false, "") }}
                 >
                     <Alert
                         onClose={() => { toggleSnackBar(false, "") }}
                         severity="success"
                         variant="filled"
                         sx={{ width: '100%' }}
                     >
                         {SnackBar.message}
                     </Alert>
                 </Snackbar>
             )
         }
     useEffect(()=>{
      
     },[])
   useEffect(()=>{
    getProduct();
    listRelatedProduct();
   },[currentLocation])
    const ShowStock = (quantity) =>{
       return (
        quantity>0?<Stack sx={{bgcolor:"lightgreen",width:"50px",alignItems:"center", borderRadius:"3px"}}>Stock</Stack>:<Stack sx={{bgcolor:"Red",width:"50px",alignItems:"center", borderRadius:"3px"}}>Stock out</Stack>
       )
    }
    const showForm=()=>{
        return (
            <Stack>
            {/* <Stack>
             <img src={path}/>
             <STac></> */}
             <Grid container spacing={1}>
              <Grid size={4}>
                <Stack>
                <img src={path} alt="/"/>
                </Stack>
              </Grid>
              <Grid size={8}>
               <Stack spacing={1}>
                <h2>{values?.product?.name}</h2>
                <h5>{values?.product?.description}</h5>
                <h6>${20}</h6>
                <h6>Category:{values?.product?.category&&values?.product?.category.name}</h6>
                {ShowStock(values?.product?.quantity)}
                <Stack direction="row" >
                <Button variant="outlined" color="success" onClick={()=>{
                   AddItem(values?.product);
                   toggleSnackBar(true,"Product Added to cart succesfully")
                }}>Add to Cart</Button>
                {/* <Button variant="contained">Buy Now</Button> */}
                </Stack>
               </Stack>
              </Grid>
             </Grid>
            </Stack>
        )
     }
     
    return (
        <Stack sx={{padding:"10px"}}>
        {/* {JSON.stringify(values?.product)} */}
        {showForm()}
        <Stack>
        {relatedProduct.length>0&&<Typography variant="h4" sx={{textAlign:"center"}}>Related books</Typography> }
        {showRelatedProduct()}
        {showSnackBar()}
        </Stack>
        </Stack>
    )
}
