import React ,{useState}from "react";
import { API } from "../../config";
import {Stack,Button, TextField, Typography} from "@mui/material"
import {useNavigate} from "react-router-dom"
import { AddItem } from "../Cart/AddItem";
import { updateItemCount } from "../Cart/AddItem";
import { removeItemFromCart } from "../Cart/AddItem";
export default function Card({product,onCart=true,UpdateCart}){
    const navigate = useNavigate();
    const path=`${API}product/photo/${product?._id}`;
    const [count,setCount] = useState(product?.count);
    const handleChange = id=>event =>{
        setCount(event.target.value>1?event.target.value:1);
        if(event.target.value>=1){
        updateItemCount(id,event.target.value);
        }
        UpdateCart();
    }
    const ShowStock = (quantity) =>{
        return (
         quantity>0?<Stack sx={{bgcolor:"lightgreen",width:"50px",alignItems:"center", borderRadius:"3px"}}><Typography>Stock</Typography></Stack>:<Stack sx={{bgcolor:"red",width:"80px"}}>Out of Stock</Stack>
        )
     }
   return (
    
    <Stack sx={{bgcolor:"#EEEEEE", cursor:"pointer", borderRadius:"10px"}}  >
        <Stack sx={{padding:"20px"}}>
        <img src={path}  alt="/" style={{borderRadius:"10px"}}/>
        </Stack>
        {/* <hr/> */}
        <Stack sx={{padding:"0px 20px 20px 20px"}} spacing={0.5}>
        <Stack>
            <Typography>{product?.name}</Typography>
        </Stack>
        {/* <Stack>
        <Typography>{product?.description}</Typography> 
        </Stack> */}
        <Stack>
            <Typography>price:${product?.price} </Typography> 
        </Stack>
        {ShowStock(product?.quantity)}
        {onCart==false&&<Stack> <TextField
          label="quantity"
          type="number"
          variant="standard"
          value={count}
          onChange={handleChange(product._id)}
        //   slotProps={{
        //     inputLabel: {
        //       shrink: true,
        //     },
        //   }}
        /></Stack>}
        <Stack direction="row" spacing={1}>
        <Button variant="outlined" onClick={()=>{navigate(`/product/${product?._id}`)}}>View Product</Button>
         {onCart&&<Button variant="outlined" onClick={()=>{
          AddItem(product);
        }}>Add to Cart</Button>}
        {onCart==false&&<Button variant="outlined" onClick={()=>{
          removeItemFromCart(product?._id);
          UpdateCart();
        }}>Remove Item</Button>}
        </Stack>
        </Stack>
    </Stack>
    );
};