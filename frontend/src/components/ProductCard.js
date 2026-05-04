import React, { useState } from "react";
import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Box,
} from "@mui/material";
import { AddShoppingCart as AddShoppingCartIcon } from "@mui/icons-material";
import ProductDetailModal from "./ProductDetailModal.js";

const ProductCard = ({ product }) => {
  const [open, setOpen] = useState(false);

  const name  = product.productName  || "Producto sin nombre";
  const price = Number(product.productPrice ?? 0);
  const stock = Number(product.stock ?? 0);
  const imageUrl = product.image ||
    `https://picsum.photos/seed/product-${product.id_product}/400/300`;

  return (
    <>
      <Card
        elevation={0}
        onClick={() => setOpen(true)}
        sx={{
          border: "1px solid #E3E8F0", borderRadius: 3,
          height: "100%", display: "flex", flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#1565C0",
            boxShadow: "0 4px 20px rgba(21,101,192,0.12)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={imageUrl}
          alt={name}
          sx={{ objectFit: "cover", borderRadius: "12px 12px 0 0" }}
        />

        <CardContent sx={{ flexGrow: 1, px: 2, pt: 1.5, pb: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: "#6B7280", fontSize: "0.72rem",
              textTransform: "uppercase", letterSpacing: "0.04em" }}
          >
            SKU: {product.SKUProduct ?? "N/A"}
          </Typography>

          <Typography
            fontWeight={600}
            sx={{
              mt: 0.25, mb: 0.75, fontSize: "0.88rem", color: "#111827",
              lineHeight: 1.35, display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}
          >
            {name}
          </Typography>

          <Typography
            variant="caption" color="text.secondary"
            sx={{ fontSize: "0.72rem" }}
          >
            Stock: {stock} unid.
          </Typography>

          <Typography
            fontWeight={700}
            sx={{ fontSize: "1.05rem", color: "#1565C0", lineHeight: 1.3, mt: 0.4 }}
          >
            ${price.toLocaleString("es-CL")}
            <Typography component="span" variant="caption"
              color="text.secondary" sx={{ ml: 0.5, fontWeight: 400 }}>
              / unid.
            </Typography>
          </Typography>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, pt: 0.5 }}>
          <Button
            fullWidth variant="contained"
            startIcon={<AddShoppingCartIcon sx={{ fontSize: "1rem !important" }} />}
            disabled={stock <= 0}
            onClick={(e) => { e.stopPropagation(); setOpen(true); }}
            sx={{
              bgcolor: "#1565C0", textTransform: "none",
              fontWeight: 600, fontSize: "0.82rem",
              borderRadius: "8px", py: 0.9,
              "&:hover": { bgcolor: "#0D47A1" },
              "&.Mui-disabled": { bgcolor: "#CFD8DC", color: "#607D8B" },
            }}
          >
            {stock <= 0 ? "Sin stock" : "Ver y agregar"}
          </Button>
        </CardActions>
      </Card>

      <ProductDetailModal
        product={product}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default ProductCard;