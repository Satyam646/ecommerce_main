import React, { useEffect, useState, useContext } from "react";
import { getApi } from "../../api";
import Grid from "@mui/material/Grid2";
import { Stack, Typography, Alert, Snackbar, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import Card from "./Cards";
import bgimage from "../../Image/bgimage.jpg";
import wallimage from "../../Image/wallimage.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home() {
    const { SnackBar, toggleSnackBar, searchData, searchedProduct, searched } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [values, setValues] = useState({ productsByArrival: [], productBySell: [], error: "" });
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const images = [bgimage, wallimage];

    const getProductByArrival = (bestSellers) => {
        getApi(`product?sortBy=createdAt&order=desc&limit=8`).then(data => {
            if (data?.error) setValues(prev => ({ ...prev, error: data.error }));
            else setValues(prev => ({ ...prev, productBySell: bestSellers, productsByArrival: data?.product }));
            setLoading(false);
        });
    };

    const getProductBySell = () => {
        getApi(`product?sortBy=sold&order=desc&limit=6`).then(data => {
            if (data?.error) {
                setValues(prev => ({ ...prev, error: data.error }));
                setLoading(false);
            } else getProductByArrival(data?.product);
        });
    };

    const getCategories = () => {
        getApi("category").then(data => {
            if (!data?.error) setCategories(data?.category);
        });
    };

    useEffect(() => {
        getCategories();
        getProductBySell();
    }, []);

    const SearchValidation = () => {
        if (!searched && searchData === "") return "";
        if (searched && searchData !== "") {
            return `${searchedProduct?.length} result${searchedProduct.length !== 1 ? 's' : ''} found.`;
        } else if (searched && searchedProduct.length === 0) {
            return "No result found.";
        }
    };

    const showSearchedData = () => (
        <Stack>
            <Grid container spacing={5}>
                {searchedProduct.map((product, index) => (
                    <Grid xs={12} md={3} key={index}>
                        <Card product={product} />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );

    const showSnackBar = () => (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: "right" }}
            autoHideDuration={3000}
            open={SnackBar?.open}
            onClose={() => toggleSnackBar(false, "")}
        >
            <Alert onClose={() => toggleSnackBar(false, "")} severity="success" variant="filled" sx={{ width: '100%' }}>
                {SnackBar.message}
            </Alert>
        </Snackbar>
    );

    const renderProducts = (products) => {
        if (loading) {
            return Array.from({ length: 4 }).map((_, index) => (
                <Grid xs={12} md={3} key={index}>
                    <Skeleton variant="rectangular" height={200} width={250} />
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                </Grid>
            ));
        }
        return products.map((product, index) => (
            <Grid xs={12} md={3} key={index}>
                <Card product={product} />
            </Grid>
        ));
    };

    return (
        <div>
            <Stack spacing={1} sx={{ padding: "5px" }}>
                <Stack>{SearchValidation()}</Stack>

                {searched && searchData !== "" && <Stack>{showSearchedData()}</Stack>}

                <Stack sx={{ width: "100%", overflow: "hidden", borderRadius: "16px" }}>
    <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
            delay: 3000,
            disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        style={{ width: "100%", height: "auto" }}
    >
        {images.map((url, index) => (
            <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
                <img
                    src={url}
                    alt={`slide-${index}`}
                    style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "500px",
                        objectFit: "cover",
                        borderRadius: "16px"
                    }}
                />
            </SwiperSlide>
        ))}
    </Swiper>
</Stack>


                <Stack spacing={2} >
                    <Typography variant="h4" sx={{ alignSelf: "center" }}>BEST SELLERS</Typography>
                    <Grid container spacing={9} >
                        {renderProducts(values.productBySell)}
                    </Grid>

                    <Typography variant="h4" sx={{ alignSelf: "center" }}>NEW ARRIVALS</Typography>
                    <Grid container spacing={9}>
                        {renderProducts(values.productsByArrival)}
                    </Grid>
                </Stack>
            </Stack>

            {showSnackBar()}
        </div>
    );
}
