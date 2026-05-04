import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, CircularProgress, Alert,
} from "@mui/material";
import ProductCard from "./ProductCard";
import { getAllProducts } from "../services/productService";

// Mapa de imagen por categoría (picsum con seed fija por id_category)
const getCategoryImage = (id_category, id_product) =>
  `https://picsum.photos/seed/product-${id_product}/300/200`;

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    getAllProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress sx={{ color: "#1565C0" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error} — Verifica que el servidor esté corriendo en el puerto 8090.
      </Alert>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="text.secondary">No hay productos disponibles aún.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography fontWeight={700} fontSize="1rem" color="#111827">
          Productos disponibles
        </Typography>
        <Typography fontSize="0.8rem" color="text.secondary">
          {products.length} {products.length === 1 ? "producto" : "productos"}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} lg={4} key={product.id_product}>
            <ProductCard product={{
              id:          product.id_product,
              name:        product.productName,
              description: product.productDescription,
              price:       product.productPrice,
              stock:       product.stock,
              category:    `Categoría ${product.id_category}`,
              minOrder:    1,
              rating:      4,
              reviews:     0,
              verified:    true,
              image:       getCategoryImage(product.id_category, product.id_product),
            }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductGrid;