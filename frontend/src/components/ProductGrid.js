import React from "react";
import { Box, Typography, Divider, Button } from "@mui/material";
import { TrendingUp as TrendingUpIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import ProductCard from "./ProductCard";

const MOCK_PRODUCTS = [
  { id: 1, name: "Sensor de Temperatura Industrial PT100 (-50°C a +400°C)", category: "Electrónica Industrial", price: 12500, minOrder: 10, rating: 4.5, reviews: 128, verified: true, badge: "Más vendido", badgeColor: "#1565C0", image: "https://picsum.photos/seed/sensor-pt100/400/300" },
  { id: 2, name: "Compresor de Aire Industrial 100L 3HP Silencioso", category: "Maquinaria", price: 285000, minOrder: 1, rating: 4, reviews: 54, verified: true, badge: null, image: "https://picsum.photos/seed/compresor-air/400/300" },
  { id: 3, name: "Resina Epóxica Bicomponente 1KG Alta Resistencia", category: "Materias Primas", price: 8900, minOrder: 20, rating: 4.5, reviews: 210, verified: false, badge: "Nuevo", badgeColor: "#43A047", image: "https://picsum.photos/seed/epoxi-resin/400/300" },
  { id: 4, name: "Switch Administrable Gigabit 24 Puertos PoE+", category: "Tecnología B2B", price: 195000, minOrder: 1, rating: 5, reviews: 36, verified: true, badge: null, image: "https://picsum.photos/seed/switch-poe/400/300" },
  { id: 5, name: "Casco de Seguridad Industrial ANSI Z89.1 Pack x12", category: "Salud y Seguridad", price: 54000, minOrder: 1, rating: 4, reviews: 87, verified: true, badge: "Oferta", badgeColor: "#E53935", image: "https://picsum.photos/seed/safety-helmet/400/300" },
  { id: 6, name: "Pallet de Madera 120x80cm Tratado NIMF-15 (x10)", category: "Logística", price: 38000, minOrder: 5, rating: 3.5, reviews: 19, verified: false, badge: null, image: "https://picsum.photos/seed/wood-pallet/400/300" },
  { id: 7, name: "Taladro Inalámbrico Profesional 20V con Maletín", category: "Ferretería", price: 67000, minOrder: 2, rating: 4.5, reviews: 142, verified: true, badge: null, image: "https://picsum.photos/seed/drill-pro/400/300" },
  { id: 8, name: "Resma Papel Bond A4 75g x500 Hojas (Caja x10)", category: "Insumos Corporativos", price: 4200, minOrder: 10, rating: 4, reviews: 305, verified: true, badge: "Popular", badgeColor: "#7B1FA2", image: "https://picsum.photos/seed/paper-ream/400/300" },
];

const ProductGrid = () => {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUpIcon sx={{ color: "#1565C0", fontSize: 22 }} />
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem", color: "#111827" }}>
            Productos Destacados
          </Typography>
        </Box>
        <Button
          endIcon={<ArrowForwardIcon sx={{ fontSize: "0.9rem !important" }} />}
          sx={{ textTransform: "none", fontSize: "0.8rem", color: "#1565C0", fontWeight: 600, "&:hover": { bgcolor: "rgba(21,101,192,0.06)" } }}
        >
          Ver todos
        </Button>
      </Box>
      <Divider sx={{ mb: 2.5, borderColor: "#E3E8F0" }} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </Box>
  );
};

export default ProductGrid;