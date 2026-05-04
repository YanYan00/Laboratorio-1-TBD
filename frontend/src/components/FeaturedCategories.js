import React, { useEffect, useState } from "react";
import { Box, Typography, Chip, Skeleton, Alert } from "@mui/material";
import { getAllCategories } from "../services/categoryService";

const FeaturedCategories = ({ onCategorySelect, selectedId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography fontWeight={700} fontSize="0.9rem" color="#374151" mb={1.5}>
        Categorías
      </Typography>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2, mb: 1, fontSize: "0.78rem" }}>{error}</Alert>
      )}

      <Box sx={{
        display: "flex", flexWrap: "wrap", gap: 1,
      }}>
        {/* Chip "Todos" */}
        {!loading && (
          <Chip
            label="Todos"
            onClick={() => onCategorySelect && onCategorySelect(null)}
            sx={{
              fontWeight: selectedId === null ? 700 : 500,
              fontSize: "0.8rem",
              bgcolor: selectedId === null ? "#1565C0" : "#F0F4FF",
              color:   selectedId === null ? "white"   : "#1565C0",
              border: "1px solid",
              borderColor: selectedId === null ? "#1565C0" : "#C7D7F0",
              "&:hover": { bgcolor: selectedId === null ? "#0D47A1" : "#DBEAFE" },
              transition: "all 0.15s",
            }}
          />
        )}

        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={100} height={32} sx={{ borderRadius: "16px" }} />
            ))
          : categories.map((cat) => {
              const isSelected = selectedId === cat.id_category;
              return (
                <Chip
                  key={cat.id_category}
                  label={cat.category_name}
                  onClick={() => onCategorySelect && onCategorySelect(cat)}
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.8rem",
                    bgcolor: isSelected ? "#1565C0" : "#F0F4FF",
                    color:   isSelected ? "white"   : "#1565C0",
                    border: "1px solid",
                    borderColor: isSelected ? "#1565C0" : "#C7D7F0",
                    "&:hover": { bgcolor: isSelected ? "#0D47A1" : "#DBEAFE" },
                    transition: "all 0.15s",
                  }}
                />
              );
            })
        }
      </Box>
    </Box>
  );
};

export default FeaturedCategories;