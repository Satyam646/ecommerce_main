import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Stack,
  Typography,
  Alert,
  Snackbar,
  Skeleton,
  Chip,
  Box,
  Container,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // latest Grid2 import
import { getApi } from "../../api";
import { API } from "../../config";
import { useLocation } from "react-router-dom";
import Card from "../Home/Cards";
import { AddItem } from "../Cart/AddItem";
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import { isAuthenticated } from "../../Common/auth/auth";

export default function SingleProduct() {
  const { SnackBar, toggleSnackBar } = useContext(ThemeContext);
  const productId = useLocation().pathname.split("/")[2];
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const productImage = product ? `${API}product/photo/${product._id}` : "";

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getApi(`product/${productId}`);
      if (!data?.error) setProduct(data);
      setLoading(false);
    };

    const fetchRelatedProducts = async () => {
      const data = await getApi(`product/related/${productId}`);
      if (!data?.error) setRelatedProducts(data);
    };

    setLoading(true);
    fetchProduct();
    fetchRelatedProducts();
  }, [productId]);

  const StockBadge = (quantity) => (
    <Chip
      label={quantity > 0 ? "In Stock" : "Out of Stock"}
      color={quantity > 0 ? "success" : "error"}
      sx={{ fontWeight: 500, fontSize: "0.85rem", width: "fit-content" }}
    />
  );

  const ProductDetails = () => (
  <Grid
    container
    spacing={4}
    alignItems="flex-start"
    justifyContent="flex-start"
    sx={{
      flexDirection: { xs: "column", md: "row" },
      px: { xs: 1, md: 0 }, // remove side padding on PC
    }}
  >
    <Grid xs={12} md={6}>
      <Box
        sx={{
          height: "100%",
          maxWidth: { xs: "100%", md: 500 },
        }}
      >
        {loading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{ borderRadius: 3 }}
          />
        ) : (
          <Box
            component="img"
            src={productImage}
            alt={product?.name || "Product Image"}
            sx={{
              width: "100%",
              maxWidth: 500,
              objectFit: "contain",
              borderRadius: 3,
              boxShadow: 3,
            }}
          />
        )}
      </Box>
    </Grid>

    <Grid xs={12} md={6}>
      <Box
        sx={{
          px: { xs: 1, md: 2 },
          py: { xs: 2, md: 0 },
          maxWidth: { md: 600 },
        }}
      >
        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="text" width="70%" height={40} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="rectangular" width="40%" height={40} />
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={700}>
              {product?.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {product?.description}
            </Typography>
            <Typography variant="h5" color="primary" fontWeight={600}>
              ${product?.price}
            </Typography>
            <Typography variant="body2">
              Category: <strong>{product?.category?.name || "Uncategorized"}</strong>
            </Typography>
            {StockBadge(product?.quantity)}

            {(JSON.parse(isAuthenticated()) === false ||
              JSON.parse(isAuthenticated())?.user?.role === 0) && (
              <Button
                variant="contained"
                color="success"
                size="large"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  width: { xs: "100%", sm: "fit-content" },
                }}
                onClick={() => {
                  AddItem(product);
                  toggleSnackBar(true, "Product added to cart successfully!");
                }}
              >
                Add to Cart
              </Button>
            )}
          </Stack>
        )}
      </Box>
    </Grid>
  </Grid>
);



  const RelatedProducts = () => (
    <Box mt={6}>
      <Typography variant="h5" textAlign="center" fontWeight={600} mb={3}>Related Books</Typography>
      <Grid container spacing={2}>
        {relatedProducts.map((item, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card product={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <ProductDetails />
      <Divider sx={{ my: 5 }} />
      {relatedProducts.length > 0 && <RelatedProducts />}

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: "right" }}
        autoHideDuration={3000}
        open={SnackBar?.open}
        onClose={() => toggleSnackBar(false, "")}
      >
        <Alert
          onClose={() => toggleSnackBar(false, "")}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {SnackBar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
