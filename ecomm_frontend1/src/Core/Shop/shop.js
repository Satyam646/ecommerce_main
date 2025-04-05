import React, { useEffect,useState } from "react"
import { Stack, TextField } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { getApi } from "../../api"
import CheckBox from "./CheckBox"
import RadioBox from "./RadioBox"
import { prices }  from "./Prices"
import { postProductApi } from "../../api"
import Cards from "../Home/Cards"
import { useContext } from 'react';
import Alert from '@mui/material/Alert';
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
export default function Shop(){
    const { SnackBar, toggleSnackBar } = useContext(ThemeContext)
        const [values,setValues] =  useState({
            categories:[{}],
            error:""
        });
        const [products,setProducts] = useState([{}]);
        const [error,setError] = useState([{}]);
        const [myfilter, setFilter] = useState({
            filter: {category:[] , price:[]}
        });    
        const handleFilters = (filters, filterBy) => {
             let arr=[];
            console.log(filters, filterBy);
            // Destructure the current filter state
            const currentFilters = {...myfilter.filter};
            // Update the specific filter based on filterBy
            if(filterBy=="price"){
                let priceDetail=prices.filter((item)=>item.id==filters)[0].array;
                console.log(priceDetail);
                currentFilters[filterBy]=priceDetail;
            }else{
                currentFilters[filterBy]=filters;
            }
            setFilter({ filter: currentFilters });
        };
    const getCategories=()=>{
         getApi("category").then(data=>{
                        if(data?.error){
                           setValues({...values,error:data?.error});
                        }else{
                            setValues({...values,categories:data?.category});
                        }
                    })
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
     const getProductByFilters= ()=>{
           const body ={
            limit:6,
            skip:0,
            filters:myfilter?.filter
           }
           postProductApi(`product/by/search`,body).then(data=>{
                             if(data?.error){
                                setError(data?.product);
                             }
                             else {
                               setProducts(data?.product); 
                             }
                         })
            }

    useEffect(()=>{
        getProductByFilters();
    },[myfilter])
    useEffect(()=>{
        getCategories();
    },[])
    return (
        <Stack>
           <Grid container spacing={1}>
            <Grid size={2} >
               <Stack sx={{marginTop:"100px"}}>
              <CheckBox categories={values?.categories} handleFilters={handleFilters} />
              <RadioBox prices={prices} handleFilters={handleFilters} />
              </Stack>
            </Grid>
            <Grid size={10}>
            <Grid container spacing={1} sx={{marginTop:"30px"}}>
                {/* <Stack sx={{marginTop:"20px"}}> */}
              {products.map((product)=>(<Grid size={3}><Cards product={product} /> </Grid>))}
              {/* </Stack> */}
              </Grid>
            </Grid>
           </Grid>
           {showSnackBar()}
        </Stack>
    )

};