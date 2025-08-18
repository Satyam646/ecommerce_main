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
  Button,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Chatbot from "../ChatBot/bot.js";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import Card from "./Cards";
import bgimage from "../../Image/bgimage.png";
import wallimage from "../../Image/wallimage.png";

// Swiper (retained for ResponsiveImageSlider dependency surface)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import ResponsiveImageSlider from './Slider';

export default function Home() {
  // Context & Navigation Hooks
  const { SnackBar, toggleSnackBar, searchData, searchedProduct, searched } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Theme & Breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Local State
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [productsBySell, setProductsBySell] = useState([]);
  const [categories, setCategories] = useState([]);
  const [arrivalsPage, setArrivalsPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Loading lanes isolated to avoid cross-talk
  const [loadingMain, setLoadingMain] = useState(true);   // initial load for arrivals
  const [loadingMore, setLoadingMore] = useState(false);  // incremental fetch for arrivals
  const [loadingBest, setLoadingBest] = useState(true);   // best sellers only

  // Images for banner
  const bannerImages = [bgimage, wallimage];

  // Sentinel for infinite scroll (prevents ref churn on “last item”)
  const sentinelRef = useRef(null);

  // Grid sizing shorthand
  const gridProps = { xs: 12, sm: 6, md: 3 };

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const { category, error } = await getApi("category");
      if (!error && Array.isArray(category)) setCategories(category);
    } catch (err) {
      console.error("Category load error:", err);
    }
  }, []);

  // Fetch Best Sellers (decoupled loading state)
  const fetchBestSellers = useCallback(async () => {
    setLoadingBest(true);
    try {
      const { product, error } = await getApi(`product?sortBy=sold&order=desc&limit=6`);
      if (!error && Array.isArray(product)) setProductsBySell(product);
    } catch (err) {
      console.error("Best sellers load error:", err);
    } finally {
      setLoadingBest(false);
    }
  }, []);

  // Fetch New Arrivals (paged, deduped, authoritative hasMore)
  const fetchNewArrivals = useCallback(async (page = 1) => {
    const limit = 4;
    const skip = (page - 1) * limit;
    page === 1 ? setLoadingMain(true) : setLoadingMore(true);

    try {
      const { product = [], error } = await getApi(
        `product?sortBy=createdAt&order=desc&limit=${limit}&skip=${skip}`
      );
      if (!error && Array.isArray(product)) {
        setProductsByArrival(prev => {
          const incoming = page === 1
            ? product
            : product.filter(p => !prev.some(q => q._id === p._id));
          // authoritative page-continue signal based on *net-new* items
          setHasMore(incoming.length > 0);
          return page === 1 ? product : [...prev, ...incoming];
        });
      } else {
        // stop the train on API signaled error
        setHasMore(false);
      }
    } catch (err) {
      console.error("Arrivals load error:", err);
      // fail-safe to avoid spin loops
      setHasMore(false);
    } finally {
      setLoadingMain(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchCategories();
    fetchBestSellers();
    fetchNewArrivals(1);
  }, [fetchCategories, fetchBestSellers, fetchNewArrivals]);

  // Load more arrivals when page increments
  useEffect(() => {
    if (arrivalsPage > 1) fetchNewArrivals(arrivalsPage);
  }, [arrivalsPage, fetchNewArrivals]);

  // IntersectionObserver wired to sentinel (prefetch window via rootMargin)
  useEffect(() => {
    if (loadingMain || loadingMore || !hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          // De-duplicate in-flight increments
          setArrivalsPage(prev => prev + 1);
        }
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadingMain, loadingMore, hasMore, productsByArrival.length]);

  // Validate search results message
  const getSearchMessage = () => {
    if (!searched && !searchData) return "";
    if (searched && searchData) {
      return `${searchedProduct.length} result${searchedProduct.length !== 1 ? 's' : ''} found.`;
    }
    return "No result found.";
  };

  // Render helpers
  const renderGridItems = (items) => {
    return items.map((prod, idx) => (
      <Grid key={prod._id || idx} {...gridProps}>
        <Card product={prod} />
      </Grid>
    ));
  };

  // Skeleton factory
  const renderSkeletonCards = (count = 4) =>
    Array.from({ length: count }).map((_, idx) => (
      <Grid key={idx} {...gridProps}>
        <Skeleton variant="rectangular" width={250} height={260} sx={{ borderRadius: 3, mb: 1 }} />
        <Skeleton width="80%" sx={{ borderRadius: 3, mb: 1 }} />
        <Skeleton width="60%" sx={{ borderRadius: 3, mb: 1 }} />
      </Grid>
    ));

  // JSX Return
  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 3, maxWidth: 1440, mx: 'auto' }}>
      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={SnackBar.open}
        autoHideDuration={3000}
        onClose={() => toggleSnackBar(false, "")}
      >
        <Alert onClose={() => toggleSnackBar(false, "")} severity="success" variant="filled">
          {SnackBar.message}
        </Alert>
      </Snackbar>

      {/* Search Results */}
      {searched && searchData && (
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary">{getSearchMessage()}</Typography>
          <Grid container spacing={4}>
            {searchedProduct.map((p, i) => (
              <Grid key={i} {...gridProps}>
                <Card product={p} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}

      {/* Banner */}
      <ResponsiveImageSlider images={bannerImages} />

      {/* Best Sellers */}
      <Stack alignItems="center" sx={{ my: 6, p: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>Best Sellers</Typography>
        <Divider sx={{ width: 80, mx: 'auto', mb: 3 }} />
        <Grid container spacing={4}>
          {loadingBest ? renderSkeletonCards(6) : renderGridItems(productsBySell)}
        </Grid>
      </Stack>

      {/* New Arrivals */}
      <Stack spacing={2} alignItems="center" sx={{ p: 4, bgcolor: 'background.default', borderRadius: 3, boxShadow: 1 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>New Arrivals</Typography>
        <Divider sx={{ width: 100, mx: 'auto', mb: 3 }} />

        <Grid container spacing={4}>
          {/* Initial skeletons */}
          {loadingMain && productsByArrival.length === 0 && renderSkeletonCards(4)}
          {/* Data rows */}
          {!loadingMain && renderGridItems(productsByArrival)}
          {/* Incremental spinner */}
          {loadingMore && (
            <Grid {...gridProps} sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Grid>
          )}
        </Grid>

        {/* Infinite scroll sentinel + manual fallback CTA */}
        <Box
          ref={sentinelRef}
          sx={{ width: '100%', height: 1, mt: 1 }}
          aria-hidden
        />
        {hasMore && !loadingMore && (
          <Button
            variant="outlined"
            onClick={() => setArrivalsPage(prev => prev + 1)}
            sx={{ mt: 2 }}
          >
            Load More
          </Button>
        )}

        <Box mt={4}><Chatbot /></Box>
      </Stack>
    </Box>
  );
}
