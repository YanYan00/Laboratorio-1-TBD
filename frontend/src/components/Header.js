import React, { useState } from "react";
import {
  AppBar, Toolbar, Box, Button, IconButton,
  Badge, Tooltip, Typography, Divider,
} from "@mui/material";
import {
  ShoppingCartOutlined as ShoppingCartOutlinedIcon,
  PersonOutlined as PersonOutlineIcon,
  AppRegistration as AppRegistrationIcon,
} from "@mui/icons-material";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";

const StoreLogo = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="NexTrade logo">
      <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15" />
      <path d="M8 10 L16 18 L8 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 10 H28 V18 H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="26" r="2.5" fill="white" />
      <circle cx="28" cy="26" r="2.5" fill="white" />
    </svg>
    <Typography variant="h6" sx={{ fontWeight: 700, color: "white", letterSpacing: "0.03em", fontSize: "1.2rem" }}>
      Nex<span style={{ fontWeight: 300 }}>Trade</span>
    </Typography>
  </Box>
);

const Header = ({ onNavigate }) => {
  const { totalItems } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <AppBar position="sticky" elevation={0}
        sx={{ background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Toolbar sx={{ width: "100%", px: { xs: 2, md: 4 }, minHeight: 64, justifyContent: "space-between" }}>
          <StoreLogo />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Tooltip title="Ver carrito" arrow>
              <IconButton aria-label="Ver carrito" onClick={() => setDrawerOpen(true)}
                sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.12)" } }}>
                <Badge badgeContent={totalItems || null} color="warning">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.25)" }} />
            <Button startIcon={<PersonOutlineIcon />} variant="outlined"
              onClick={() => onNavigate("login")}
              sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", textTransform: "none", fontWeight: 500, fontSize: "0.875rem",
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}>
              Iniciar sesión
            </Button>
            <Button startIcon={<AppRegistrationIcon />} variant="contained"
              onClick={() => onNavigate("register")}
              sx={{ bgcolor: "white", color: "#1565C0", textTransform: "none", fontWeight: 700, fontSize: "0.875rem",
                boxShadow: "none", "&:hover": { bgcolor: "rgba(255,255,255,0.88)", boxShadow: "none" } }}>
              Registrarse
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={onNavigate} />
    </>
  );
};

export default Header;