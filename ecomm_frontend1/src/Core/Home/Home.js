import React, { useEffect, useState, useContext } from "react";
import { getApi } from "../../api";
import Grid from "@mui/material/Grid2";
import {
  Stack,
  Typography,
  Alert,
  Snackbar,
  Skeleton,
  Box,
  Divider
} from "@mui/material";
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
    <Grid container spacing={4}>
      {searchedProduct.map((product, index) => (
        <Grid item size={{xs:"12",sm:"6",md:"4",lg:"3"}} key={index}>
          <Card product={product} />
        </Grid>
      ))}
    </Grid>
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
        <Grid item size={{xs:"12",sm:"6",md:"4",lg:"3"}} key={index}>
          <Skeleton variant="rectangular" height={300} width={300} sx={{ borderRadius: 2 }} />
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </Grid>
      ));
    }
    return products.map((product, index) => (
      <Grid item size={{xs:"12",sm:"6",md:"4",lg:"3"}} key={index}>
        <Card product={product} />
      </Grid>
    ));
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
      {showSnackBar()}

      {/* Search Results */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {searched && searchData !== "" && (
          <>
            <Typography variant="h6" color="text.secondary">{SearchValidation()}</Typography>
            {showSearchedData()}
          </>
        )}
      </Stack>

      {/* Banner Section */}
      <Box sx={{ mb: 5, borderRadius: 3, overflow: 'hidden', boxShadow: 2 }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          centeredSlides
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          style={{ width: "100%", height: "auto" }}
        >
          {images.map((url, index) => (
            <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={url}
                alt={`slide-${index}`}
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "cover"
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Best Sellers */}
      <Stack spacing={3} sx={{ mb: 6 }}>
        <Typography variant="h4" align="center" fontWeight={600} gutterBottom>Best Sellers</Typography>
        <Divider />
        <Grid container spacing={6}>
          {renderProducts(values.productBySell)}
        </Grid>
      </Stack>

      {/* New Arrivals */}
      <Stack spacing={3}>
        <Typography variant="h4" align="center" fontWeight={600} gutterBottom>New Arrivals</Typography>
        <Divider />
        <Grid container spacing={6}>
          {renderProducts(values.productsByArrival)}
        </Grid>
      </Stack>
    </Box>
  );
}
