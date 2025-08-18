import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Stack,
  Box,
  Typography,
  Skeleton,
  Fab,
  Zoom,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Grid from '@mui/material/Grid';
import { getApi, postProductApi } from "../../api";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";
import { prices } from "./Prices";
import Cards from "../Home/Cards";
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';

export default function Shop() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { SnackBar, toggleSnackBar } = useContext(ThemeContext);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ category: [], price: [] });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { category = [], error } = await getApi("category");
      if (!error) setCategories(category);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products by filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const body = { limit: 6, skip: 0, filters };
      const { product = [], error } = await postProductApi("product/by/search", body);
      if (!error) setProducts(product);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Handle filter changes
  const handleFilters = (values, type) => {
    setFilters(prev => {
      const updated = { ...prev };
      if (type === 'price') {
        const priceArr = prices.find(p => p.id === values)?.array || [];
        updated.price = priceArr;
      } else {
        updated.category = values;
      }
      return updated;
    });
  };

  // Scroll-to-top logic
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Initial fetches
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <Box sx={{ px: isMobile ? 2 : 4, py: isMobile ? 2 : 4, bgcolor: '#f9f9f9' }}>

      {/* Mobile Filters Accordion */}
      {isMobile && (
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <CheckBox categories={categories} handleFilters={vals => handleFilters(vals, 'category')} />
              <RadioBox prices={prices} handleFilters={vals => handleFilters(vals, 'price')} />
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}

      <Grid container spacing={isMobile ? 2 : 4} justifyContent={isMobile ? 'center' : 'flex-start'}> 
        {/* Sidebar for Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={2}>
            <Stack spacing={3} sx={{ position: 'sticky', top: 100, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
              <CheckBox categories={categories} handleFilters={vals => handleFilters(vals, 'category')} />
              <RadioBox prices={prices} handleFilters={vals => handleFilters(vals, 'price')} />
            </Stack>
          </Grid>
        )}

        {/* Products */}
        <Grid item xs={12} md={10}>
          <Grid container spacing={isMobile ? 2 : 4}>
            {loading
              ? Array.from({ length: isMobile ? 4 : 6 }).map((_, i) => (
                  <Grid item xs={10} sm={6} md={3} key={i} sx={{ mx: isMobile ? 'auto' : 0 }}> 
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                    <Skeleton width="70%" />
                    <Skeleton width="50%" />
                  </Grid>
                ))
              : products.length > 0
              ? products.map((prod, i) => (
                  <Grid item xs={10} sm={6} md={3} key={prod._id || i} sx={{ mx: isMobile ? 'auto' : 0 }}> 
                    <Cards product={prod} />
                  </Grid>
                ))
              : (
                <Grid item xs={12}>
                  <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h6" color="primary" gutterBottom>No Products Found</Typography>
                    <Typography variant="body2" color="text.secondary">Try different filters or search terms.</Typography>
                  </Box>
                </Grid>
              )}
          </Grid>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar open={SnackBar.open} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => toggleSnackBar(false, '')}>
        <Alert onClose={() => toggleSnackBar(false, '')} severity="success" variant="filled">{SnackBar.message}</Alert>
      </Snackbar>

      {/* Scroll-to-Top FAB */}
      <Zoom in={showScroll}>
        <Fab onClick={scrollToTop} color="primary" size="small" sx={{ position: 'fixed', bottom: 20, right: 20 }}>
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Box>
  );
}
