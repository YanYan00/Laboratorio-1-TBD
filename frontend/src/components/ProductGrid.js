import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Grid, CircularProgress, Alert,
} from "@mui/material";
import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import ProductCard from "./ProductCard";

const BASE_URL = "http://localhost:8090/api/products";

// Debounce simple para no disparar fetch en cada tecla
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const ProductGrid = ({ categoryId, searchValue }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const debouncedSearch = useDebounce(searchValue, 400);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError("");

    let url;
    if (debouncedSearch?.trim()) {
      // Búsqueda por keyword contra el back
      url = `${BASE_URL}/search?keyword=${encodeURIComponent(debouncedSearch.trim())}`;
    } else if (categoryId) {
      // Filtro por categoría
      url = `${BASE_URL}?id_category=${categoryId}`;
    } else {
      // Todos los productos
      url = BASE_URL;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar productos");
        return res.json();
      })
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [categoryId, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const sectionTitle = debouncedSearch?.trim()
    ? `Resultados para "${debouncedSearch.trim()}"`
    : categoryId
      ? "Productos de la categoría"
      : "Productos Destacados";

  return (
    <Box>
      {/* Encabezado */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <TrendingUpIcon sx={{ color: "#1565C0", fontSize: 20 }} />
        <Typography fontWeight={700} fontSize="1rem" color="#111827">
          {sectionTitle}
        </Typography>
        {!loading && (
          <Typography fontSize="0.78rem" color="text.secondary">
            ({products.length} {products.length === 1 ? "producto" : "productos"})
          </Typography>
        )}
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>{error}</Alert>
      )}

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#1565C0" }} />
        </Box>
      )}

      {/* Sin resultados */}
      {!loading && !error && products.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary" fontSize="0.9rem">
            {debouncedSearch
              ? `No se encontraron productos para "${debouncedSearch}".`
              : "No hay productos disponibles en esta categoría."}
          </Typography>
        </Box>
      )}

      {/* Grid */}
      {!loading && !error && products.length > 0 && (
        <Grid container spacing={2}>
          {products.map((product) => (
            <Grid key={product.id_product} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProductGrid;