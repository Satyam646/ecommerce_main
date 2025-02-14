import React from "react";
import { API } from "../../config";
import {Stack,Button} from "@mui/material"
import {useNavigate} from "react-router-dom"
export default function Card({product}){
    const navigate = useNavigate();
    const path=`${API}product/photo/${product?._id}`;
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
        <Stack direction="row">
        <Button variant="contained" onClick={()=>{navigate(`/product/${product?._id}`)}}>View Product</Button>
        <Button variant="contained" >Add to Cart</Button>
        </Stack>
    </Stack>
    );
};