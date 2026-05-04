import React, { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductGrid from "../components/ProductGrid";

const HomePage = ({ onNavigate, onSearchResults }) => {
  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} lg={2.5}>
            <FeaturedCategories />
          </Grid>
          <Grid item xs={12} md={9} lg={9.5}>
            <ProductGrid />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;