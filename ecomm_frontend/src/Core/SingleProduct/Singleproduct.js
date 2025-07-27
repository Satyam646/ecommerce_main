import React, { useState, useEffect, useContext } from "react";
import { Button, Stack, Typography, Alert, Snackbar, Skeleton, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
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

    const productImage = product ? `${API}product/photo/${product._id}` : "";

    const fetchProduct = async () => {
        const data = await getApi(`product/${productId}`);
        if (!data?.error) setProduct(data);
        setLoading(false);
    };

    const fetchRelatedProducts = async () => {
        const data = await getApi(`product/related/${productId}`);
        if (!data?.error) setRelatedProducts(data);
    };

    useEffect(() => {
        setLoading(true);
        fetchProduct();
        fetchRelatedProducts();
    }, [productId]);

    const StockBadge = (quantity) => (
        <Chip
            label={quantity > 0 ? "In Stock" : "Out of Stock"}
            color={quantity > 0 ? "success" : "error"}
            variant="filled"
            sx={{ fontWeight: 500, fontSize: "0.85rem" }}
        />
    );

    const ProductDetails = () => {
        if (loading) {
            return (
                <Grid container spacing={4} alignItems="center">
                    <Grid xs={12} md={6}>
                        <Skeleton variant="rectangular" height={250} width={250} sx={{ borderRadius: 2 }} />
                    </Grid>
                    <Grid xs={12} md={6}>
                        <Stack spacing={2}>
                            <Skeleton variant="text" width="80%" height={40} />
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="30%" />
                            <Skeleton variant="rectangular" width="40%" height={40} />
                        </Stack>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid container spacing={4} alignItems="center">
                <Grid xs={12} md={6}>
                    <Stack alignItems="center">
                        <img
                            src={productImage}
                            alt={product?.name || "Product Image"}
                            style={{
                                width: "100%",
                                maxHeight: "500px",
                                objectFit: "contain",
                                borderRadius: 12,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                            }}
                        />
                    </Stack>
                </Grid>

                <Grid xs={12} md={6}>
                    <Stack spacing={2}>
                        <Typography variant="h4" fontWeight="bold">{product?.name}</Typography>
                        <Typography variant="body1" color="text.secondary">{product?.description}</Typography>
                        <Typography variant="h5" color="primary" fontWeight="600">${product?.price || "20"}</Typography>
                        <Typography variant="body2">Category: {product?.category?.name || "Uncategorized"}</Typography>
                        {StockBadge(product?.quantity)}
                        {(JSON.parse(isAuthenticated())==false||JSON.parse(isAuthenticated())?.user?.role === 0)&&<Stack direction="row" spacing={2} mt={2}>
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                sx={{ borderRadius: 2, textTransform: "none" }}
                                onClick={() => {
                                    AddItem(product);
                                    toggleSnackBar(true, "Product added to cart successfully!");
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Stack>}
                    </Stack>
                </Grid>
            </Grid>
        );
    };

    const RelatedProducts = () => {
        if (!relatedProducts.length) return null;

        return (
            <Stack spacing={2} mt={5}>
                <Typography variant="h5" textAlign="center">Related Books</Typography>
                <Grid container spacing={2}>
                    {relatedProducts.map((item, index) => (
                        <Grid xs={12} sm={6} md={3} key={index}>
                            <Card product={item} />
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        );
    };

    return (
        <Stack spacing={4} sx={{ padding: "20px" }}>
            {ProductDetails()}
            {RelatedProducts()}

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
        </Stack>
    );
}
