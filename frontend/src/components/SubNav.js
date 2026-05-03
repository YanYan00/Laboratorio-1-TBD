import React, { useState } from "react";
import {
  Box,
  Container,
  Button,
  InputBase,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Search as SearchIcon,
  HeadsetMicOutlined as HeadsetMicOutlinedIcon,
  MailOutlined as MailOutlineIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";

const CATEGORIES = [
  "Electrónica",
  "Maquinaria",
  "Materias Primas",
  "Insumos de Oficina",
  "Salud y Seguridad",
  "Logística",
  "Tecnología",
  "Ferretería",
];

const SubNav = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const handleCategoryOpen = (event, category) => {
    setAnchorEl(event.currentTarget);
    setActiveCategory(category);
  };

  const handleCategoryClose = () => {
    setAnchorEl(null);
    setActiveCategory(null);
  };

  return (
    <Box
      component="nav"
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #E3E8F0",
        boxShadow: "0 1px 4px rgba(21,101,192,0.06)",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 52,
            gap: 2,
          }}
        >
          {/* LEFT — Categorías */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
              "&::-webkit-scrollbar": { display: "none" },
              flexShrink: 0,
              maxWidth: { xs: "60%", md: "55%" },
            }}
          >
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                endIcon={<KeyboardArrowDownIcon sx={{ fontSize: "0.9rem !important" }} />}
                onClick={(e) => handleCategoryOpen(e, cat)}
                sx={{
                  color: activeCategory === cat ? "#1565C0" : "#374151",
                  textTransform: "none",
                  fontWeight: activeCategory === cat ? 600 : 400,
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  px: 1.5,
                  py: 1.5,
                  borderRadius: 0,
                  borderBottom: activeCategory === cat ? "2px solid #1565C0" : "2px solid transparent",
                  transition: "all 0.15s ease",
                  "&:hover": { color: "#1565C0", bgcolor: "rgba(21,101,192,0.04)" },
                }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCategoryClose}
            PaperProps={{
              elevation: 3,
              sx: { mt: 0.5, borderRadius: 2, minWidth: 180 },
            }}
          >
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                Subcategorías próximamente
              </Typography>
            </MenuItem>
          </Menu>

          {/* RIGHT — Búsqueda + Soporte + Contacto */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#F3F6FB",
                border: "1px solid #D1DBF0",
                borderRadius: "8px",
                px: 1.5,
                py: 0.5,
                gap: 0.5,
                width: { xs: 140, sm: 220, md: 280 },
                transition: "border-color 0.2s",
                "&:focus-within": { borderColor: "#1565C0", bgcolor: "white" },
              }}
            >
              <SearchIcon sx={{ fontSize: 18, color: "#6B7280" }} />
              <InputBase
                placeholder="Buscar productos..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{ fontSize: "0.8rem", flex: 1 }}
                inputProps={{ "aria-label": "Buscar productos" }}
              />
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <Tooltip title="Soporte técnico" arrow>
              <Button
                startIcon={<HeadsetMicOutlinedIcon sx={{ fontSize: "1rem !important" }} />}
                sx={{
                  color: "#374151",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  px: 1.5,
                  "&:hover": { color: "#1565C0", bgcolor: "rgba(21,101,192,0.05)" },
                  display: { xs: "none", md: "flex" },
                }}
              >
                Soporte
              </Button>
            </Tooltip>

            <Tooltip title="Envíanos un mensaje" arrow>
              <Button
                startIcon={<MailOutlineIcon sx={{ fontSize: "1rem !important" }} />}
                sx={{
                  color: "#374151",
                  textTransform: "none",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  px: 1.5,
                  "&:hover": { color: "#1565C0", bgcolor: "rgba(21,101,192,0.05)" },
                  display: { xs: "none", md: "flex" },
                }}
              >
                Contacto
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SubNav;