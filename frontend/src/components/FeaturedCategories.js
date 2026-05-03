import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Bolt as BoltIcon,
  PrecisionManufacturing as PrecisionManufacturingIcon,
  Science as ScienceIcon,
  Computer as ComputerIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  LocalShipping as LocalShippingIcon,
  Hardware as HardwareIcon,
  BusinessCenter as BusinessCenterIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

const FEATURED_CATS = [
  { label: "Electrónica Industrial", icon: <BoltIcon /> },
  { label: "Maquinaria",             icon: <PrecisionManufacturingIcon /> },
  { label: "Materias Primas",        icon: <ScienceIcon /> },
  { label: "Tecnología B2B",         icon: <ComputerIcon /> },
  { label: "Salud y Seguridad",      icon: <HealthAndSafetyIcon /> },
  { label: "Logística",              icon: <LocalShippingIcon /> },
  { label: "Ferretería",             icon: <HardwareIcon /> },
  { label: "Insumos Corporativos",   icon: <BusinessCenterIcon /> },
];

const FeaturedCategories = () => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        border: "1px solid #E3E8F0",
        boxShadow: "0 2px 8px rgba(21,101,192,0.06)",
        overflow: "hidden",
        height: "fit-content",
      }}
    >
      <Box sx={{ px: 2.5, py: 2, bgcolor: "#F0F4FF" }}>
        <Typography variant="subtitle1" fontWeight={700} color="#1565C0" fontSize="0.9rem">
          Categorías Destacadas
        </Typography>
      </Box>
      <Divider />
      <List disablePadding>
        {FEATURED_CATS.map((cat, idx) => (
          <React.Fragment key={cat.label}>
            <ListItemButton
              sx={{
                py: 1,
                px: 2,
                "&:hover": {
                  bgcolor: "rgba(21,101,192,0.05)",
                  "& .MuiListItemText-primary": { color: "#1565C0" },
                  "& .arrow-icon": { opacity: 1, transform: "translateX(3px)" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "#1565C0" }}>
                {React.cloneElement(cat.icon, { sx: { fontSize: 20 } })}
              </ListItemIcon>
              <ListItemText
                primary={cat.label}
                primaryTypographyProps={{
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  color: "#374151",
                  transition: "color 0.15s",
                }}
              />
              <ChevronRightIcon
                className="arrow-icon"
                sx={{
                  fontSize: 16,
                  color: "#9CA3AF",
                  opacity: 0,
                  transition: "all 0.15s ease",
                }}
              />
            </ListItemButton>
            {idx < FEATURED_CATS.length - 1 && (
              <Divider sx={{ mx: 2, borderColor: "#F3F4F6" }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default FeaturedCategories;