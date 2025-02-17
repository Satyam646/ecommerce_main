import react,{useState,useEffect} from "react"
import { Button, Stack } from "@mui/material"
import { getApi } from "../../api"
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid2"
import { API } from "../../config";
import Card from "../Home/Cards"
import { AddItem } from "../Cart/AddItem";
export default function SingleProduct(){
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
        <Grid container>
       
        {relatedProduct.map((product)=>  <Grid size={4}><Stack height="300px"><Card product={product}/></Stack></Grid>)}
       
        </Grid> 
      </Stack>
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
        quantity>0?<Stack sx={{bgcolor:"lightgreen",width:"50px"}}>Stock</Stack>:<Stack sx={{bgcolor:"red",width:"80px"}}>Stock out</Stack>
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
               <Stack>
                <h2>{values?.product?.name}</h2>
                <h5>{values?.product?.description}</h5>
                <h6>${20}</h6>
                <h6>Category:{values?.product?.category&&values?.product?.category.name}</h6>
                {ShowStock(values?.product?.quantity)}
                <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={()=>{
                   AddItem(values?.product);
                }}>Add to Cart</Button>
                <Button variant="contained">Buy Now</Button>
                </Stack>
               </Stack>
              </Grid>
             </Grid>
            </Stack>
        )
     }
     
    return (
        <Stack>
        {/* {JSON.stringify(values?.product)} */}
        {showForm()}
        <Stack>
         <h2>RelatedProduct</h2>
         
        {showRelatedProduct()}
         
        </Stack>
        </Stack>
    )
}
