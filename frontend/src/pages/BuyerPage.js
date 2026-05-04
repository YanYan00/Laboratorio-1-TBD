import React, { useState } from "react";
import {
  Box, Container, Grid, AppBar, Toolbar,
  Typography, IconButton, Tooltip,
} from "@mui/material";
import { HomeOutlined as HomeIcon } from "@mui/icons-material";
import BuyerSidebar from "../components/buyer/BuyerSidebar";
import BuyerOrders  from "../components/buyer/BuyerOrders";
import BuyerProfile from "../components/buyer/BuyerProfile";

const StoreLogo = ({ onNavigate }) => (
  <Box onClick={() => onNavigate("home")}
    sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer",
      "&:hover": { opacity: 0.85 }, transition: "opacity 0.2s" }}>
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15" />
      <path d="M8 10 L16 18 L8 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 10 H28 V18 H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="26" r="2.5" fill="white" />
      <circle cx="28" cy="26" r="2.5" fill="white" />
    </svg>
    <Typography variant="h6" sx={{ fontWeight: 700, color: "white", fontSize: "1.1rem" }}>
      Nex<span style={{ fontWeight: 300 }}>Trade</span>
    </Typography>
  </Box>
);

const BuyerPage = ({ onNavigate, onLogout }) => {
  const [activeSection, setActiveSection] = useState("orders");

  const renderSection = () => {
    switch (activeSection) {
      case "profile": return <BuyerProfile />;
      case "help":    return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">Centro de ayuda próximamente.</Typography>
        </Box>
      );
      default: return <BuyerOrders />;
    }
  };

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={0}
        sx={{ background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: 64, justifyContent: "space-between" }}>
          <StoreLogo onNavigate={onNavigate} />
          <Tooltip title="Ir al inicio" arrow>
            <IconButton onClick={() => onNavigate("home")} aria-label="Ir al inicio"
              sx={{ color: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.12)", color: "white" } }}>
              <HomeIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        {/* MUI v6: usar size en lugar de item */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3, lg: 2.5 }}>
            <BuyerSidebar
              activeSection={activeSection}
              onSelect={setActiveSection}
              onLogout={onLogout}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
            {renderSection()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BuyerPage;