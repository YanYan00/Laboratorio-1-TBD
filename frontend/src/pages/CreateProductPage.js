import React, { useState, useEffect } from "react";
import {
  Container, Paper, Typography, TextField,
  Button, Box, Alert, CircularProgress,
  MenuItem, Select, InputLabel, FormControl, FormHelperText,
} from "@mui/material";

const CreateProductPage = ({ onNavigate }) => {
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(false);
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    stock: "",
    id_category: "",
    SKU_product: "",
  });

  // Carga categorías al montar
  useEffect(() => {
    fetch("http://localhost:8090/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las categorías");
        return res.json();
      })
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setCatsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8090/api/products/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName:        formData.product_name,
          productDescription: formData.product_description,
          productPrice:       Number(formData.product_price),
          stock:              Number(formData.stock),
          id_category:        Number(formData.id_category),
          skuProduct:         Number(formData.SKU_product),
          id_user:            2,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => onNavigate("home"), 2000);
        return;
      }

      if (response.status === 403) throw new Error("No tienes permiso o tu sesión expiró.");

      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Error al publicar");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "#1565C0" }}>
          Publicar Nuevo Producto
        </Typography>

        {error   && <Alert severity="error"   sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>¡Producto guardado exitosamente!</Alert>}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <TextField
              fullWidth label="Nombre del Producto" name="product_name"
              value={formData.product_name} onChange={handleChange} required
            />

            <TextField
              fullWidth label="Descripción" name="product_description"
              multiline rows={3}
              value={formData.product_description} onChange={handleChange}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth label="Precio ($)" name="product_price" type="number"
                value={formData.product_price} onChange={handleChange} required
              />
              <TextField
                fullWidth label="Stock Inicial" name="stock" type="number"
                value={formData.stock} onChange={handleChange} required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>

              {/* Select de categorías */}
              <FormControl fullWidth required>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  name="id_category"
                  value={formData.id_category}
                  label="Categoría"
                  onChange={handleChange}
                  disabled={catsLoading}
                  renderValue={(val) => {
                    const cat = categories.find((c) => c.id_category === Number(val));
                    return cat ? cat.category_name : "";
                  }}
                >
                  {catsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ mr: 1 }} /> Cargando...
                    </MenuItem>
                  ) : (
                    categories.map((cat) => (
                      <MenuItem key={cat.id_category} value={cat.id_category}>
                        {cat.category_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {catsLoading && (
                  <FormHelperText>Cargando categorías...</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth label="SKU" name="SKU_product" type="number"
                value={formData.SKU_product} onChange={handleChange} required
              />
            </Box>

            <Button
              fullWidth variant="contained" type="submit"
              disabled={loading || success || !formData.id_category}
              sx={{ mt: 2, height: 48, fontWeight: "bold" }}
            >
              {loading
                ? <CircularProgress size={24} color="inherit" />
                : "PUBLICAR AHORA"}
            </Button>

            <Button
              fullWidth variant="text" color="inherit"
              onClick={() => onNavigate("home")}
              disabled={loading}
            >
              CANCELAR
            </Button>

          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProductPage;