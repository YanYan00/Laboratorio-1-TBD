import React, { useState } from "react";
import {
  AppBar, Toolbar, Box, Button, IconButton,
  Badge, Tooltip, Typography, Divider,
} from "@mui/material";
import {
  ShoppingCartOutlined   as ShoppingCartOutlinedIcon,
  PersonOutlined         as PersonOutlineIcon,
  AppRegistration        as AppRegistrationIcon,
  AccountCircleOutlined as AccountIcon,
  LogoutOutlined         as LogoutIcon,
} from "@mui/icons-material";
import CartDrawer from "./CartDrawer";
import LogoutDialog from "./LogoutDialog";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PercentIcon from '@mui/icons-material/Percent';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PaymentsIcon from '@mui/icons-material/Payments'

const StoreLogo = ({ onNavigate }) => (
  <Box onClick={() => onNavigate("home")}
    sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer",
      "&:hover": { opacity: 0.85 }, transition: "opacity 0.2s" }}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="NexTrade logo">
      <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15" />
      <path d="M8 10 L16 18 L8 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 10 H28 V18 H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="26" r="2.5" fill="white" />
      <circle cx="28" cy="26" r="2.5" fill="white" />
    </svg>
    <Typography variant="h6"
      sx={{ fontWeight: 700, color: "white", letterSpacing: "0.03em", fontSize: "1.2rem" }}>
      Nex<span style={{ fontWeight: 300 }}>Trade</span>
    </Typography>
  </Box>
);

const Header = ({ onNavigate, mode = "guest", onLogout }) => {
  const { totalItems }                      = useCart();
  const { user }                            = useAuth();
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [dialogOpen, setDialogOpen]         = useState(false);
  const isAdmin = user?.id_auth === 1;

  const handleLogoutConfirm = () => {
    setDialogOpen(false);
    onLogout();
  };

  const CartButton = () => (
    <Tooltip title="Ver carrito" arrow>
      <IconButton aria-label="Ver carrito" onClick={() => setDrawerOpen(true)}
        sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.12)" } }}>
        <Badge badgeContent={totalItems || null} color="warning">
          <ShoppingCartOutlinedIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
        <Toolbar sx={{ width: "100%", px: { xs: 2, md: 4 }, minHeight: 64, justifyContent: "space-between" }}>

          <StoreLogo onNavigate={onNavigate} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>

            {/* GUEST */}
            {mode === "guest" && (
              <>
                <CartButton />
                <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.25)" }} />
                <Button startIcon={<PersonOutlineIcon />} variant="outlined"
                  onClick={() => onNavigate("login")}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", textTransform: "none",
                    fontWeight: 500, fontSize: "0.875rem",
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}>
                  Iniciar sesión
                </Button>
                <Button startIcon={<AppRegistrationIcon />} variant="contained"
                  onClick={() => onNavigate("register")}
                  sx={{ bgcolor: "white", color: "#1565C0", textTransform: "none", fontWeight: 700,
                    fontSize: "0.875rem", boxShadow: "none",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.88)", boxShadow: "none" } }}>
                  Registrarse
                </Button>
              </>
            )}

            {/* BUYER */}
            {mode === "buyer" && (
              <>
                {user?.username && (
                  <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.82rem", mr: 0.5 }}>
                    Hola, <strong style={{ color: "white" }}>{user.username}</strong>
                  </Typography>
                )}
                <CartButton />
                <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.25)" }} />
                <Button startIcon={<AccountIcon />} variant="outlined"
                  onClick={() => onNavigate("buyer")}
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", textTransform: "none",
                    fontWeight: 600, fontSize: "0.875rem",
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" } }}>
                  Mi cuenta
                </Button>
                <Tooltip title="Cerrar sesión" arrow>
                  <IconButton onClick={() => setDialogOpen(true)} aria-label="Cerrar sesión"
                    sx={{ color: "rgba(255,255,255,0.8)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.12)", color: "white" } }}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
           {/*Solo visible si isAdmin es true (Rol 1) */}
            {isAdmin && (
  <>
    {/* Botón de Descuentos existente */}
    <Button 
      onClick={() => onNavigate("discounts")}
      variant="contained"
      startIcon={<PercentIcon />}
      sx={{ 
        bgcolor: "#FFD54F", 
        color: "#0D47A1", 
        fontWeight: 'bold',
        textTransform: 'none',
        borderRadius: '20px',
        px: 2,
        mr: 1,
        "&:hover": { bgcolor: "#FFC107" } 
      }}
    >
      Aplicar Descuento
    </Button>

    {/* NUEVO: Botón de Pagos Pendientes */}
    <Button 
      onClick={() => onNavigate("pending-payments")} 
      variant="contained"
      startIcon={<PaymentsIcon />} 
      sx={{ 
        bgcolor: "#D32F2F",
        color: "white", 
        fontWeight: 'bold',
        textTransform: 'none',
        borderRadius: '20px',
        px: 2,
        "&:hover": { bgcolor: "#B71C1C" } 
      }}
    >
      Pagos Pendientes
    </Button>
  </>
)}
            {user && (
            <Button 
              onClick={() => onNavigate("create-product")}
              variant="outlined"
              startIcon={<AddCircleIcon />}
              sx={{ 
                color: "white", 
                borderColor: "rgba(255,255,255,0.5)", 
                textTransform: "none",
                borderRadius: '20px',
                "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" }
              }}
            >
              Vender Producto
            </Button>
          )}
            
          
          </Box>
        </Toolbar>
      </AppBar>

      {/* CartDrawer disponible en ambos modos */}
      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={onNavigate}
      />

      <LogoutDialog
        open={dialogOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
};

export default Header;