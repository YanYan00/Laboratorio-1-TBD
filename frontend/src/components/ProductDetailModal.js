import React, { useState } from "react";
import {
  Dialog, DialogContent,
  Box, Typography, Button, IconButton,
  Divider, TextField,
} from "@mui/material";
import {
  Close              as CloseIcon,
  AddShoppingCart    as CartIcon,
  Add                as AddIcon,
  Remove             as RemoveIcon,
  CheckCircleOutlined as CheckIcon,
  Inventory2Outlined as InventoryIcon,
  TagOutlined        as TagIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";

const ProductDetailModal = ({ product, open, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);
  const { addToCart }           = useCart();

  if (!product) return null;

  const name        = product.productName        || "Producto sin nombre";
  const description = product.productDescription || "Sin descripción disponible.";
  const price       = Number(product.productPrice ?? 0);
  const stock       = Number(product.stock ?? 0);
  const imageUrl    = product.image ||
    `https://picsum.photos/seed/product-${product.id_product}/400/300`;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const changeQty = (delta) =>
    setQuantity((q) => Math.min(stock, Math.max(1, q + delta)));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
    >
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: "absolute", top: 12, right: 12, zIndex: 10,
          bgcolor: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          "&:hover": { bgcolor: "#F5F5F5" },
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>

          {/* Imagen grande */}
          <Box sx={{
            bgcolor: "#F5F7FB",
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: { xs: 220, md: 420 },
            p: 3,
          }}>
            <Box
              component="img"
              src={imageUrl}
              alt={name}
              sx={{ width: "100%", maxHeight: 380, objectFit: "contain", borderRadius: 2 }}
            />
          </Box>

          {/* Detalle */}
          <Box sx={{ p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", gap: 2 }}>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                <TagIcon sx={{ fontSize: 14, color: "#9CA3AF" }} />
                <Typography fontSize="0.72rem" color="text.secondary"
                  textTransform="uppercase" letterSpacing="0.05em">
                  SKU: {product.SKUProduct ?? "N/A"}
                </Typography>
              </Box>
              <Typography fontWeight={700} fontSize="1.15rem" color="#111827" lineHeight={1.3}>
                {name}
              </Typography>
            </Box>

            {/* Precio */}
            <Box sx={{ bgcolor: "#F0F4FF", borderRadius: 2, px: 2.5, py: 1.5 }}>
              <Typography fontSize="0.75rem" color="#6B7280" mb={0.25}>Precio unitario</Typography>
              <Typography fontWeight={800} fontSize="1.6rem" color="#1565C0" lineHeight={1}>
                ${price.toLocaleString("es-CL")}
                <Typography component="span" fontSize="0.85rem" color="text.secondary"
                  fontWeight={400} ml={0.5}>/ unid.</Typography>
              </Typography>
              {quantity > 1 && (
                <Typography fontSize="0.78rem" color="#43A047" fontWeight={600} mt={0.5}>
                  Total: ${(price * quantity).toLocaleString("es-CL")}
                </Typography>
              )}
            </Box>

            {/* Descripción */}
            <Box>
              <Typography fontSize="0.75rem" fontWeight={600} color="#374151" mb={0.5}
                textTransform="uppercase" letterSpacing="0.05em">
                Descripción
              </Typography>
              <Typography fontSize="0.85rem" color="#6B7280" lineHeight={1.6}>
                {description}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "#F3F4F6" }} />

            {/* Stock */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon sx={{ fontSize: 16, color: stock > 0 ? "#43A047" : "#E53935" }} />
              <Typography fontSize="0.82rem" fontWeight={600}
                color={stock > 0 ? "#43A047" : "#E53935"}>
                {stock > 0 ? `${stock} unidades disponibles` : "Sin stock"}
              </Typography>
            </Box>

            {/* Selector de cantidad */}
            {stock > 0 && (
              <Box>
                <Typography fontSize="0.75rem" fontWeight={600} color="#374151" mb={1}
                  textTransform="uppercase" letterSpacing="0.05em">
                  Cantidad
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton size="small" onClick={() => changeQty(-1)} disabled={quantity <= 1}
                    sx={{ border: "1px solid #E3E8F0", borderRadius: 1.5,
                      "&:hover": { bgcolor: "#F0F4FF", borderColor: "#1565C0" } }}>
                    <RemoveIcon sx={{ fontSize: 16 }} />
                  </IconButton>

                  <TextField
                    size="small"
                    value={quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v)) setQuantity(Math.min(stock, Math.max(1, v)));
                    }}
                    inputProps={{
                      min: 1, max: stock,
                      style: { textAlign: "center", width: 48, fontWeight: 700 },
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 }, width: 72 }}
                  />

                  <IconButton size="small" onClick={() => changeQty(1)} disabled={quantity >= stock}
                    sx={{ border: "1px solid #E3E8F0", borderRadius: 1.5,
                      "&:hover": { bgcolor: "#F0F4FF", borderColor: "#1565C0" } }}>
                    <AddIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* Botón agregar */}
            <Button
              fullWidth variant="contained"
              startIcon={added ? <CheckIcon /> : <CartIcon />}
              onClick={handleAdd}
              disabled={stock <= 0}
              sx={{
                mt: "auto",
                bgcolor: added ? "#43A047" : "#1565C0",
                textTransform: "none", fontWeight: 700,
                fontSize: "0.9rem", borderRadius: 2, py: 1.2,
                transition: "background 0.3s",
                "&:hover": { bgcolor: added ? "#388E3C" : "#0D47A1" },
                "&.Mui-disabled": { bgcolor: "#CFD8DC", color: "#607D8B" },
              }}
            >
              {stock <= 0
                ? "Sin stock"
                : added
                  ? `¡${quantity > 1 ? `${quantity} unidades` : "Producto"} agregado!`
                  : `Agregar${quantity > 1 ? ` (${quantity})` : ""} al carrito`}
            </Button>

          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;