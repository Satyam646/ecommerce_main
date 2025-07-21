import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Box
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../Common/auth/auth";
import { getAllProducts, DeleteProduct } from "./Adminapi";
import { API } from "../config";
export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const { user, token } = JSON.parse(isAuthenticated());
  const navigate = useNavigate();
  const loadProducts = () => {
    getAllProducts().then(data => {
      if (data?.error) {
        console.log(data.error);
      } else {
        setProducts(data.product);
      }
    });
  };
  const removeProduct = (productId, userId, tokenId) => {
    DeleteProduct(productId, userId, tokenId).then(data => {
      if (data?.error) {
        console.log(data.error);
      } else {
        console.log("Product Deleted Successfully");
        loadProducts();
      }
    });
  };
  const showList = () => (
    <Stack spacing={3} sx={{ width: "100%", maxWidth: "900px" }}>
      {products?.map(p => (
        <Card
          key={p?._id}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            bgcolor: "background.paper"
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid key={`${p?._id}-img`} item size={{ xs: "12", sm: "3" }}>
                <Box
                  component="img"
                  src={`${API}product/photo/${p?._id}`}
                  alt={p?.name}
                  sx={{
                    width: "100%",
                    maxHeight: 120,
                    objectFit: "cover",
                    borderRadius: 2
                  }}
                />
              </Grid>

              <Grid key={`${p?._id}-name`} item size={{ xs: "12", sm: "4" }}>
                <Typography variant="h6" fontWeight={600}>
                  {p?.name}
                </Typography>
              </Grid>

              <Grid key={`${p?._id}-update`} item size={{ xs: "12", sm: "2" }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate(`/admin/product/update/${p?._id}`)}
                >
                  Update
                </Button>
              </Grid>
              <Grid key={`${p?._id}-delete`} item size={{ xs: "12", sm: "3" }}>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => removeProduct(p?._id, user?._id, token)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
  useEffect(() => {
    loadProducts();
  }, []);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "column",
        px: 2,
        py: 4
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "900px", mx: "auto" }}>
        <Typography variant="h5" align="center" fontWeight={600} sx={{ mb: 3 }}>
          Total {products?.length} Product{products.length !== 1 ? "s" : ""}
        </Typography>
        {showList()}
      </Box>
    </Box>
  );
}
