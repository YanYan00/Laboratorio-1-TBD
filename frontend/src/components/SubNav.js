import React, { useState } from "react";
import {
  Box, Container, Button, Menu, MenuItem, Divider,
  TextField, InputAdornment, IconButton, Typography,
} from "@mui/material";
import {
  KeyboardArrowDown as ArrowDownIcon,
  Search as SearchIcon,
  HeadsetMicOutlined as SupportIcon,
  MailOutlined as ContactIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { searchProducts } from "../services/productService";

const CATEGORIES = [
  "Electrónica industrial",
  "Maquinaria y equipos",
  "Materiales de construcción",
  "Seguridad laboral",
  "Insumos de oficina",
  "Tecnología y TI",
  "Logística y almacén",
  "Químicos y laboratorio",
];

const SubNav = ({ onSearchResults }) => {
  const [anchorEl, setAnchorEl]     = useState(null);
  const [keyword, setKeyword]       = useState("");
  const [searching, setSearching]   = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setSearching(true);
    try {
      const results = await searchProducts(keyword);
      if (onSearchResults) onSearchResults(results, keyword);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => {
    setKeyword("");
    if (onSearchResults) onSearchResults(null, "");
  };

  return (
    <Box sx={{ bgcolor: "white", borderBottom: "1px solid #E3E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1, flexWrap: "wrap" }}>

          {/* Menú categorías */}
          <Button
            endIcon={<ArrowDownIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ textTransform: "none", color: "#374151", fontWeight: 600, fontSize: "0.875rem",
              "&:hover": { bgcolor: "rgba(21,101,192,0.05)", color: "#1565C0" } }}
          >
            Todas las categorías
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { borderRadius: 2, border: "1px solid #E3E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", mt: 0.5 } }}>
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} onClick={() => setAnchorEl(null)}
                sx={{ fontSize: "0.875rem", color: "#374151", py: 1,
                  "&:hover": { bgcolor: "rgba(21,101,192,0.05)", color: "#1565C0" } }}>
                {cat}
              </MenuItem>
            ))}
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "#E3E8F0" }} />

          {/* Barra de búsqueda */}
          <Box component="form" onSubmit={handleSearch}
            sx={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center" }}>
            <TextField
              size="small" fullWidth
              placeholder="Buscar productos por nombre o descripción..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
                endAdornment: keyword && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClear}>
                      <ClearIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem",
                "&.Mui-focused fieldset": { borderColor: "#1565C0" },
                "&:hover fieldset": { borderColor: "#1565C0" } } }}
            />
            <Button type="submit" variant="contained" disabled={searching || !keyword.trim()}
              sx={{ ml: 1, bgcolor: "#1565C0", textTransform: "none", fontWeight: 600,
                borderRadius: "8px", px: 2.5, boxShadow: "none", whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" },
                "&.Mui-disabled": { bgcolor: "#B0BEC5", color: "white" } }}>
              Buscar
            </Button>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ borderColor: "#E3E8F0" }} />

          {/* Soporte y Contacto */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Button startIcon={<SupportIcon sx={{ fontSize: "1rem !important" }} />}
              sx={{ textTransform: "none", color: "#6B7280", fontSize: "0.8rem",
                "&:hover": { color: "#1565C0", bgcolor: "rgba(21,101,192,0.04)" } }}>
              Soporte
            </Button>
            <Button startIcon={<ContactIcon sx={{ fontSize: "1rem !important" }} />}
              sx={{ textTransform: "none", color: "#6B7280", fontSize: "0.8rem",
                "&:hover": { color: "#1565C0", bgcolor: "rgba(21,101,192,0.04)" } }}>
              Contacto
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SubNav;