import react, { useEffect,useState } from "react"
import { Button, Stack, Typography } from "@mui/material"
import { getProductOnCart } from "./AddItem"
import Grid from "@mui/material/Grid2";
import Card from "../Home/Cards";
import { isAuthenticated } from "../../Common/auth/auth";
import { useNavigate } from "react-router-dom";

export default function Cart(){
    const [products,setProducts] = useState();
    const navigate = useNavigate();
    const UpdateProducts = ()=>{
    let arr=getProductOnCart();
    setProducts(arr);
    }
    const getTotal = () =>{
        const value= products?.reduce((acc,currval) => acc+(currval.count*currval.price),0);
        // setValue(value);
        return value;
    }
    const checkOut= () =>{
   return (
    <Stack>
       <Typography variant="h5">Total Item Summary</Typography>
       <Typography>Total Price:${getTotal()}</Typography>
       {isAuthenticated()&&<Button variant="contained" sx={{alignSelf:"left"}}>Checkout</Button>}
       {!isAuthenticated()&&<Button variant="contained" onClick={()=>{
        navigate("/signin")
       }}>please Signin..</Button>}
    </Stack>
   )
    }
    useEffect(()=>{
        UpdateProducts();
    },[])
    return (
        <Stack>
            {products?.length==0?<h5>Your Cart is empty...</h5>:
            <Grid container spacing={1}>
            <Grid size={4}>
                <Stack spacing={1}>
                {products?.map((product,indx)=>
                         <Card key={indx} product={product} onCart={false} UpdateCart={UpdateProducts}/>
                )}
                </Stack>
            </Grid>
            <Grid  size={8}>
                {checkOut()}
            </Grid>
        </Grid>}
            
        </Stack>
    )
}

