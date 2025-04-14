import React ,{useState}from "react";
import { API } from "../../config";
import {Stack,Button, TextField, Typography,useMediaQuery, useTheme, Box} from "@mui/material"

import {useNavigate} from "react-router-dom"
import { AddItem } from "../Cart/AddItem";
import { updateItemCount } from "../Cart/AddItem";
import { removeItemFromCart } from "../Cart/AddItem";
import { useContext } from "react";
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';

export default function Card({product,onCart=true,UpdateCart}){
    const {toggleSnackBar} = useContext(ThemeContext)
    const theme = useTheme();
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
         quantity>0?<Stack sx={{bgcolor:"lightgreen",width:"50px",alignItems:"center", borderRadius:"3px" }}><Typography>Stock</Typography></Stack>:<Stack sx={{bgcolor:"red",width:"80px",alignItems:"center", borderRadius:"3px"}}>StockOut</Stack>
        )
     }
  //  return (
    
  //   <Stack sx={{bgcolor:"#EEEEEE", cursor:"pointer", borderRadius:"10px"}}  >
  //       <Stack sx={{padding:"20px"}}>
  //       <img src={path}  alt="/" height="300px" style={{borderRadius:"10px"}}/>
  //       </Stack>
  //       {/* <hr/> */}
  //       <Stack sx={{padding:"0px 20px 20px 20px"}} spacing={0.5}>
  //       <Stack>
  //           <Typography>{product?.name}</Typography>
  //       </Stack>
  //       {/* <Stack>
  //       <Typography>{product?.description}</Typography> 
  //       </Stack> */}
  //       <Stack>
  //           <Typography>price:${product?.price} </Typography> 
  //       </Stack>
  //       {ShowStock(product?.quantity)}
  //       {onCart==false&&<Stack> <TextField
  //         label="quantity"
  //         type="number"
  //         variant="standard"
  //         value={count}
  //         onChange={handleChange(product._id)}
  //       //   slotProps={{
  //       //     inputLabel: {
  //       //       shrink: true,
  //       //     },
  //       //   }}
  //       /></Stack>}
  //       <Stack direction="row" spacing={1}>
  //       <Button variant="outlined" onClick={()=>{navigate(`/product/${product?._id}`)}}>View Product</Button>
  //        {onCart&&<Button variant="outlined" color="success" onClick={()=>{
  //         AddItem(product);
  //         toggleSnackBar(true,"Product Added to cart succesfully")
  //       }}>Add to Cart</Button>}
  //       {onCart==false&&<Button variant="outlined" color="error" onClick={()=>{
  //         removeItemFromCart(product?._id);
  //         UpdateCart();
  //       }}>Remove Item</Button>}
  //       </Stack>
  //       </Stack>
  //   </Stack>
  //   );
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      onClick={() => onCart&&navigate(`/product/${product?._id}`)}
      sx={{
        bgcolor: "#f5f5f5",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: 3,
        width: isMobile ? "100%" : 300,
        
        transition: "transform 0.3s",
        '&:hover': {
          transform: "scale(1.02)",
          cursor: "pointer",
        },
      }}
    >
      <Box sx={{ p: 2, }} onClick={() => navigate(`/product/${product?._id}`)}>
        <img
          src={path}
          alt={product?.name}
          height="320px"
          width="100%"
          // sx={{ width: 100, height: 100 }}
          // style={{ objectFit: "cover", borderRadius: "1px" }}
        />
      </Box>

      <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {product?.name}
        </Typography>

        {/* Uncomment to show description */}
        {/* <Typography variant="body2" color="text.secondary">
          {product?.description}
        </Typography> */}

        <Typography variant="subtitle1" color="text.primary">
          Price: ${product?.price}
        </Typography>

        {ShowStock(product?.quantity)}

        {!onCart && (
          <TextField
            label="Quantity"
            type="number"
            variant="standard"
            value={count}
            onChange={handleChange(product._id)}
            fullWidth
          />
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {/* <Button
            variant="outlined"
            fullWidth={isMobile}
            onClick={() => navigate(`/product/${product?._id}`)}
          >
            View Product
          </Button> */}

          {/* {onCart && (
            <Button
              variant="outlined"
              color="success"
              fullWidth={isMobile}
              onClick={() => {
                AddItem(product);
                toggleSnackBar(true, "Product added to cart successfully");
              }}
            >
              Add to Cart
            </Button>
          )} */}

          {!onCart && (
            <Button
              variant="outlined"
              color="error"
              fullWidth={isMobile}
              onClick={() => {
                removeItemFromCart(product?._id);
                UpdateCart();
              }}
            >
              Remove Item
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};