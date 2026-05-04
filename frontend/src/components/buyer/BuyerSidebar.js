import React, { useState } from "react";
import {
  Box, Typography, Avatar, Divider,
  List, ListItemButton, ListItemIcon, ListItemText,
} from "@mui/material";
import {
  ShoppingBagOutlined as OrdersIcon,
  PersonOutlined as PersonIcon,
  HelpOutlined as HelpIcon,
  LogoutOutlined as LogoutIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import LogoutDialog from "../LogoutDialog";
import { useAuth } from "../../context/AuthContext";

const MENU_ITEMS = [
  { key: "orders",  label: "Mis compras", icon: <OrdersIcon /> },
  { key: "profile", label: "Mi perfil",   icon: <PersonIcon /> },
  { key: "help",    label: "Ayuda",       icon: <HelpIcon /> },
];

const BuyerSidebar = ({ activeSection, onSelect, onLogout }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      <Box sx={{ bgcolor: "white", border: "1px solid #E3E8F0", borderRadius: 3, overflow: "hidden",
        boxShadow: "0 2px 8px rgba(21,101,192,0.06)" }}>
        <Box sx={{ background: "linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)",
          px: 3, py: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: "rgba(255,255,255,0.2)",
            color: "white", fontSize: "1.4rem", fontWeight: 700, border: "2px solid rgba(255,255,255,0.4)" }}>
            {initials}
          </Avatar>
          <Box sx={{ textAlign: "center" }}>
            <Typography fontWeight={700} sx={{ color: "white", fontSize: "0.95rem" }}>
              {user?.username || "Usuario"}
            </Typography>
            <Typography fontSize="0.75rem" sx={{ color: "rgba(255,255,255,0.7)", mt: 0.25 }}>
              {user?.email || ""}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List disablePadding sx={{ py: 1 }}>
          {MENU_ITEMS.map((item) => (
            <ListItemButton key={item.key} selected={activeSection === item.key}
              onClick={() => onSelect(item.key)}
              sx={{ px: 2.5, py: 1.25,
                borderLeft: activeSection === item.key ? "3px solid #1565C0" : "3px solid transparent",
                "&.Mui-selected": { bgcolor: "rgba(21,101,192,0.06)",
                  "& .MuiListItemText-primary": { color: "#1565C0", fontWeight: 700 },
                  "& .MuiListItemIcon-root": { color: "#1565C0" } },
                "&:hover": { bgcolor: "rgba(21,101,192,0.04)" } }}>
              <ListItemIcon sx={{ minWidth: 36, color: "#6B7280" }}>
                {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
              </ListItemIcon>
              <ListItemText primary={item.label}
                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }} />
              <ChevronRightIcon sx={{ fontSize: 16, color: "#D1D5DB" }} />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        <List disablePadding sx={{ py: 1 }}>
          <ListItemButton onClick={() => setDialogOpen(true)}
            sx={{ px: 2.5, py: 1.25, "&:hover": { bgcolor: "rgba(229,57,53,0.04)" } }}>
            <ListItemIcon sx={{ minWidth: 36, color: "#E53935" }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión"
              primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 500, color: "#E53935" }} />
          </ListItemButton>
        </List>
      </Box>

      <LogoutDialog
        open={dialogOpen}
        onConfirm={() => { setDialogOpen(false); onLogout(); }}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
};

export default BuyerSidebar;