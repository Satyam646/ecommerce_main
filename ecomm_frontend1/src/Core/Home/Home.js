import React, { useEffect, useState } from "react"
import { getApi } from "../../api"
import Grid from "@mui/material/Grid2";
import { Stack, Button, Select, MenuItem, TextField, FormControl, InputLabel, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import SimpleImageSlider from "react-simple-image-slider";
import { useContext } from 'react';
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import bookBecho from "../../Image/BookBecho.png"
import bgimage from "../../Image/bgimage.jpg"
import wallimage from "../../Image/wallimage.png"
// import queryString from 'query-string';
import Card from "./Cards"
export default function Home() {
    const { SnackBar, toggleSnackBar, searchData, searchedProduct, setsearchedProduct, searched, setSearched } = useContext(ThemeContext)
    const navigate = useNavigate();
    const [values, setValues] = useState({
        productsByArrival: [{}],
        productBySell: [{}],
        searchedData: [{}],
        error: "",
        bestSellers: "",
    });


    // const [searchData,setSearchData] = useState("");
    const [categories, setcategories] = useState([{}]);
    const [selectedCategory, setSelectedCategory] = useState();
    // const handleSearch=(event)=>{
    //     setSearchData(event.target.value);
    // }
    const handleCategory = (event) => {
        setSelectedCategory(event.target.value);
    }
    const getProductByArrival = (product) => {
        // Here We Have to pass the query in this Api
        getApi(`product?sortBy=createdAt&order=desc&limit=8`).then(data => {
            if (data?.error) {
                setValues({ ...values, error: data?.error });
            }
            else {
                setValues({ ...values, productBySell: product, productsByArrival: data?.product });
            }
        })
    }

    const getProductBySell = () => {
        getApi(`product?sortBy=sold&order=desc&limit=6`).then(data => {
            if (data?.error) {
                setValues({ ...values, error: data?.error });
            } else {
                //  setValues({...values,productBySell:data?.product});
                getProductByArrival(data?.product);
            }
        })
    }
    const getCategories = () => {
        getApi("category").then(data => {
            if (data?.error) {
                setValues({ ...values, error: data?.error });
            } else {
                setcategories(data?.category);
            }
        })
    }
    useEffect(() => {
        getCategories();
    }, [])
    useEffect(() => {
        getProductBySell();
    }, [])

    // console.log("products detail",values?.product);
    const SearchValdation = () => {
        if (searched == false&&searchData=="") {
            return "";
        }
        if (searched == true&&searchData!="") {
            return `${searchedProduct?.length} result Found..`
        }
        else if (searched == true && searchedProduct.length == 0) {
            return "No result found"
        }
    }
    const showSearchedData = () => {
        console.log(searchedProduct, "searchData");
        return (
            <Stack>

                <Grid container spacing={3}>
                    {searchedProduct?.map((product, indx) => {
                        return (
                            <Grid size={3} key={indx}>
                                <Card product={product} />
                            </Grid>
                        )
                    })}
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
    const images = [
        { url: bgimage },
        { url: wallimage },
        
        // { url: "images/3.jpg" },
        // { url: "images/4.jpg" },
        // { url: "images/5.jpg" },
        // { url: "images/6.jpg" },
        // { url: "images/7.jpg" },
      ];
    const showform = () => {
        return (
            <Stack spacing={2}>
                <Typography variant="h4" sx={{ alignSelf: "center" }}>BEST SELLERS</Typography>
                <Grid container spacing={3}>
                    {values?.productBySell?.map((product, indx) => {
                        return (
                            <Grid size={3} key={indx}>
                                <Card product={product} />
                            </Grid>
                        )
                    })}
                </Grid>
                <Typography variant="h4" sx={{ alignSelf: "center" }}>NEW ARRIVALS</Typography>
                <Grid container spacing={3}>
                    {values?.productsByArrival?.map((product, indx) => {
                        return (
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
            <Stack spacing={1} sx={{padding:"5px"}}>
                {/* <Stack>{SearchBar()}</Stack> */}
                <Stack>{SearchValdation()}</Stack>
                {searched == true&&searchData!=""&&<Stack>{showSearchedData()}</Stack>}
                <Stack sx={{ width: "100vw", overflow: "hidden" }}>
      <SimpleImageSlider
        width={"99%"}
        height={500}
        images={images}
        showBullets={true}
        showNavs={true}
      />
    </Stack>
                <Stack> {showform()}</Stack>
            </Stack>
            {showSnackBar()}
        </div>
    )
}
