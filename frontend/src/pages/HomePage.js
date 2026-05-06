import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import FeaturedCategories from "../components/FeaturedCategories";
import ProductGrid        from "../components/ProductGrid";

const HomePage = ({ onNavigate, searchValue, onSearchChange, refreshSignal }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <FeaturedCategories
          selectedId={selectedCategory?.id_category ?? null}
          onCategorySelect={handleCategorySelect}
        />
        <ProductGrid
          categoryId={selectedCategory?.id_category ?? null}
          searchValue={searchValue}
          refreshSignal={refreshSignal} 
        />
      </Container>
    </Box>
  );
};

export default HomePage;