import React from "react";
import { API } from "../../config";
import {Stack,Button} from "@mui/material"
import {useNavigate} from "react-router-dom"
import { AddItem } from "../Cart/AddItem";
export default function Card({product,onCart=true}){
    const navigate = useNavigate();
    const path=`${API}product/photo/${product?._id}`;
    const ShowStock = (quantity) =>{
        return (
         quantity>0?<Stack sx={{bgcolor:"lightgreen",width:"50px"}}>Stock</Stack>:<Stack sx={{bgcolor:"red",width:"80px"}}>Out of Stock</Stack>
        )
     }
   return (
    
    <Stack >
        <Stack>
        <img src={path}  />
        </Stack>
        <Stack>
            {product?.name}
        </Stack>
        <Stack>
            {product?.description}
        </Stack>
        <Stack>
            price:${product?.price}
        </Stack>
        {ShowStock(product?.quantity)}
        <Stack direction="row">
        <Button variant="contained" onClick={()=>{navigate(`/product/${product?._id}`)}}>View Product</Button>
        {onCart&&<Button variant="contained" onClick={()=>{
          AddItem(product);
        }}>Add to Cart</Button>}
        </Stack>
    </Stack>
    );
};