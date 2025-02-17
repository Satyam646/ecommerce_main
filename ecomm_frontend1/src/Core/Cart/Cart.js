import react, { useEffect,useState } from "react"
import { Stack } from "@mui/material"
import { getProductOnCart } from "./AddItem"
import Grid from "@mui/material/Grid2";
import Card from "../Home/Cards";

export default function Cart(){
    const [products,setProducts] = useState([]);
    useEffect(()=>{
        setProducts(getProductOnCart());
    },[])
    return (
        <Stack>
            <Grid container spacing={1}>
                <Grid size={4}>
                    {products.map((product,indx)=>
                             <Card key={indx} product={product} onCart={false}/>
                    )}
                </Grid>
                <Grid  size={8}>
                    update itams
                </Grid>
            </Grid>
        </Stack>
    )
}

