import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import { getApi } from "../../api";
import Grid from "@mui/material/Grid2";
import {
  Stack,
  Typography,
  Alert,
  Snackbar,
  Skeleton,
  Box,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Chatbot from "../ChatBot/bot.js";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import Card from "./Cards";
import bgimage from "../../Image/bgimage.png";
import wallimage from "../../Image/wallimage.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home() {
  const { SnackBar, toggleSnackBar, searchData, searchedProduct, searched } = useContext(ThemeContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [values, setValues] = useState({ productsByArrival: [], productBySell: [], error: "" });
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [arrivalsPage, setArrivalsPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const images = [bgimage, wallimage];
  const observer = useRef();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const getProductByArrival = (page = 1) => {
    const limit = 4;
    const skip = (page - 1) * limit;

    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    getApi(`product?sortBy=createdAt&order=desc&limit=${limit}&skip=${skip}`)
      .then(data => {
        if (data?.error) {
          setValues(prev => ({ ...prev, error: data.error }));
        } else {
          const newProducts = data.product || [];
          setHasMore(newProducts.length > 0);

          setValues(prev => ({
            ...prev,
            productsByArrival: page === 1
              ? newProducts
              : [...prev.productsByArrival, ...newProducts.filter(
                p => !prev.productsByArrival.some(prevProd => prevProd._id === p._id)
              )]
          }));
        }
        setLoading(false);
        setLoadingMore(false);
      });
  };

  const getProductBySell = () => {
    getApi(`product?sortBy=sold&order=desc&limit=6`).then(data => {
      if (data?.error) {
        setValues(prev => ({ ...prev, error: data.error }));
        setLoading(false);
      } else {
        setValues(prev => ({ ...prev, productBySell: data.product }));
      }
    });
  };

  const getCategories = () => {
    getApi("category").then(data => {
      if (!data?.error) setCategories(data?.category);
    });
  };

  const lastProductElementRef = useCallback(node => {
    if (loading || loadingMore || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setArrivalsPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    if (arrivalsPage > 1) {
      getProductByArrival(arrivalsPage);
    }
  }, [arrivalsPage]);

  useEffect(() => {
    getCategories();
    getProductBySell();
    getProductByArrival(1);
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
        <Grid key={index} item size={{ xs: "12", sm: "12", md: "3", lg: "3" }}>
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

  const renderProducts = (products, isArrivals = false) => {
    if (loading&&isArrivals) {
      return (<Grid container spacing={10}>
        {Array.from({ length: 4 }).map((_, index) => (
        <Grid key={index} item size={{ xs: "12", sm: "12", md: "3", lg: "3" }}>
          <Skeleton variant="rectangular" height={260} width={250} sx={{ borderRadius: 3, mb: 1,ml:isMobile?4:0}} />
          <Skeleton width="80%" sx={{ borderRadius: 3, mb: 1,ml:4}}/>
          <Skeleton width="60%" sx={{ borderRadius: 3, mb: 1,ml:4}}/>
        </Grid>
      ))}
      </Grid>)
    }

    return products?.map((product, index) => {
      const isLastProduct = isArrivals && index === products.length - 1;
      return (
        <Grid
          key={index}
          item
          size={{ xs: "12", sm: "12", md: "3", lg: "3" }}
          ref={isLastProduct ? lastProductElementRef : null}
          sx={{
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 4,
            }
          }}
        >
          <Card product={product} />
        </Grid>
      );
    });
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 3, maxWidth: "1440px", mx: "auto" }}>
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
      <Box
        sx={{
          mb: 6,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 3,
          maxHeight: "500px"
        }}
      >
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
            <SwiperSlide key={index} style={{ display:"flex",justifyContent:"center",alignItems:"center"}}>
              <img
                src={url}
                alt={`slide-${index}`}
                style={{
                  width: "100%",
      height: "500px",
      objectFit: "cover"
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Best Sellers */}
      <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 2, mb: 6 }}>
        <Typography variant="h4" align="center" fontWeight={700} color="primary" gutterBottom>
          Best Sellers
        </Typography>
        <Divider sx={{ width: 80, borderBottomWidth: 3, borderColor: "primary.main", mx: "auto", mb: 3 }} />
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {renderProducts(values.productBySell,true)}
        </Grid>
      </Box>

      {/* New Arrivals */}
      <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.default", borderRadius: 3, boxShadow: 1 }}>
        <Typography variant="h4" align="center" fontWeight={700} color="text.primary" gutterBottom>
          New Arrivals
        </Typography>
        <Divider sx={{ width: 100, borderBottomWidth: 3, borderColor: "secondary.main", mx: "auto", mb: 3 }} />
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {renderProducts(values.productsByArrival, true)}
          {loadingMore && (
            <Grid item size={{ xs: "12" }} sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Grid>
          )}
        </Grid>
        <Box><Chatbot/></Box>
      </Box>
    </Box>
  )
}
