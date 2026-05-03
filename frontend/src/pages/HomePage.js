import React from "react";
import { Box, Container } from "@mui/material";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductGrid from "../components/ProductGrid";

const HomePage = () => {
  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          <FeaturedCategories />
          <ProductGrid />
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;