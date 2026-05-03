import React, { useState } from "react";
import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Chip, Box, Rating, Tooltip, IconButton,
} from "@mui/material";
import {
  AddShoppingCart as AddShoppingCartIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Card elevation={0}
      sx={{ border: "1px solid #E3E8F0", borderRadius: 3, height: "100%", display: "flex", flexDirection: "column",
        transition: "all 0.2s ease",
        "&:hover": { borderColor: "#1565C0", boxShadow: "0 4px 20px rgba(21,101,192,0.12)", transform: "translateY(-2px)" } }}>
      <Box sx={{ position: "relative" }}>
        <CardMedia component="img" height="160" image={product.image} alt={product.name}
          sx={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }} />
        {product.badge && (
          <Chip label={product.badge} size="small"
            sx={{ position: "absolute", top: 10, left: 10, fontSize: "0.7rem", fontWeight: 700,
              bgcolor: product.badgeColor || "#1565C0", color: "white" }} />
        )}
        <IconButton size="small" onClick={() => setLiked(!liked)} aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
          sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", "&:hover": { bgcolor: "white" } }}>
          {liked
            ? <FavoriteIcon sx={{ fontSize: 16, color: "#E53935" }} />
            : <FavoriteBorderIcon sx={{ fontSize: 16, color: "#9CA3AF" }} />}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="caption"
          sx={{ color: "#6B7280", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {product.category}
        </Typography>
        <Typography variant="body2" fontWeight={600}
          sx={{ mt: 0.25, mb: 0.75, fontSize: "0.88rem", color: "#111827", lineHeight: 1.35,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <Rating value={product.rating} readOnly precision={0.5} size="small" sx={{ fontSize: 14 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>({product.reviews})</Typography>
          {product.verified && (
            <Tooltip title="Proveedor verificado" arrow>
              <VerifiedIcon sx={{ fontSize: 14, color: "#1565C0", ml: "auto" }} />
            </Tooltip>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
          Precio unitario (min. {product.minOrder} unid.)
        </Typography>
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.05rem", color: "#1565C0", lineHeight: 1.3 }}>
          ${product.price.toLocaleString("es-CL")}
          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 400 }}>
            / unid.
          </Typography>
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0.5 }}>
        <Button fullWidth variant="contained"
          startIcon={<AddShoppingCartIcon sx={{ fontSize: "1rem !important" }} />}
          onClick={handleAddToCart}
          sx={{ bgcolor: added ? "#43A047" : "#1565C0", textTransform: "none", fontWeight: 600, fontSize: "0.82rem",
            borderRadius: "8px", py: 0.9, transition: "background 0.3s",
            "&:hover": { bgcolor: added ? "#388E3C" : "#0D47A1" } }}>
          {added ? "¡Agregado!" : "Agregar al carrito"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;