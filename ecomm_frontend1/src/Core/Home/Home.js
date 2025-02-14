import React, { useEffect,useState } from "react"
import { getApi } from "../../api"
import  Grid  from "@mui/material/Grid2";
import {Stack,Button,Select,MenuItem,TextField, FormControl, InputLabel} from "@mui/material"
// import queryString from 'query-string';
import Card from "./Cards"
export default function Home(){
    const [values,setValues] = useState({
        productsByArrival:[{}],
        productBySell:[{}],
        searchedData:[{}],
        error:"",
        bestSellers:"",
    });
    const [searched,setSearched] = useState(false);
    const [searchedProduct,setsearchedProduct]=useState([]);
    const [searchData,setSearchData] = useState("");
    const [categories,setcategories] = useState([{}]);
    const [selectedCategory,setSelectedCategory] = useState();
    const handleSearch=(event)=>{
        setSearchData(event.target.value);
    }
    const handleCategory =(event)=>{
        setSelectedCategory(event.target.value);
    }
    const getProductByArrival= (product)=>{
        // Here We Have to pass the query in this Api
        getApi(`product?sortBy=createdAt&order=desc&limit=6`).then(data=>{
                         if(data?.error){
                            setValues({...values,error:data?.error});
                         }
                         else {
                           setValues({...values,productBySell:product,productsByArrival:data?.product}); 
                         }
                     })
   }
   const getSearchData=(e)=>{
   
    e.preventDefault();
    setSearched(true);
    const query={search:searchData,category:selectedCategory}
    const queryString = new URLSearchParams(query).toString();
    getApi(`searchBy?${queryString}`).then(data=>{
        if(data?.error){
           setValues({...values,error:data?.error});
        }
        else {
          setsearchedProduct(data);
        }
    })
   }
   const getProductBySell=()=>{
    getApi(`product?sortBy=sold&order=desc&limit=6`).then(data=>{
                     if(data?.error){
                        setValues({...values,error:data?.error});
                     }else{
                        //  setValues({...values,productBySell:data?.product});
                         getProductByArrival(data?.product);
                     }
                 })
 }
 const getCategories=()=>{
          getApi("category").then(data=>{
                         if(data?.error){
                            setValues({...values,error:data?.error});
                         }else{
                            setcategories(data?.category);
                         }
                     })
     }
     useEffect(()=>{
        getCategories();
     },[])
     useEffect(()=>{
        getProductBySell();
   },[])
   const SearchBar=()=>{
         return(
         <Stack direction="row" alignSelf="center"  >
            <form onSubmit={getSearchData}>
            {/* <Stack> */}
            <FormControl sx={{width:"100px"}}>
                <InputLabel>Select </InputLabel>
         <Select
               value={selectedCategory}
               label="Select"
               onChange={handleCategory}
         >
        {categories?.map((data,indx)=>
         (<MenuItem key={indx} value={data?._id}>{data?.name}</MenuItem>)
        )}
        </Select>
        </FormControl>
        {/* </Stack> */}
         <TextField  
           label="Search"
           value={searchData}
           onChange={handleSearch} />
           <Button variant="" type="submit">Search</Button>
           </form>
         </Stack>
         )
     }
    // console.log("products detail",values?.product);
     const SearchValdation = () =>{
                if(searched==false){
                    return "";
                }
                if(searched==true){
          return `${searchedProduct?.length} result Found..`
                }
                else if(searched==true&&searchedProduct.length==0){
                  return "No result found"
                }
     }
     const showSearchedData = () =>{
        console.log(searchedProduct,"searchData");
          return (
            <Stack>
           
            <Grid container spacing={3}> 
            {searchedProduct?.map((product,indx)=>{
                return(
                <Grid size={3} key={indx}>
                <Card product={product} />
                </Grid>
                )
            })}
            </Grid>
            </Stack>
        )
     }
     const showform = () => {
        return (
            <Stack>
            <h1>Most sell Product</h1> 
            
            <Grid container spacing={3}> 
            {values?.productBySell?.map((product,indx)=>{
                return(
                <Grid size={3} key={indx}>
                <Card product={product} />
                </Grid>
                )
            })}
            </Grid>
           <h1>New Arivals</h1> 
            <Grid container spacing={3}> 
            {values?.productsByArrival?.map((product,indx)=>{
                return(
                <Grid size={3} key={indx}>
                <Card product={product} />
                </Grid>
                )
            })}
            </Grid>
            </Stack>
        )
     }
    return (
        <div>
         <Stack spacing={1}>
         <Stack>{SearchBar()}</Stack>
         <Stack>{ SearchValdation()}</Stack>
            <Stack>{showSearchedData()}</Stack>
            
            <Stack> {showform()}</Stack>
          </Stack>
        </div>
    )
}
