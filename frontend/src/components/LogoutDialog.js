import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box,
} from "@mui/material";
import { LogoutOutlined as LogoutIcon } from "@mui/icons-material";

const LogoutDialog = ({ open, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth
    PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
    <DialogTitle sx={{ pb: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ bgcolor: "rgba(229,57,53,0.08)", borderRadius: "50%", p: 1, display: "flex" }}>
          <LogoutIcon sx={{ color: "#E53935", fontSize: 22 }} />
        </Box>
        <Typography fontWeight={700} fontSize="1rem" color="#111827">
          Cerrar sesión
        </Typography>
      </Box>
    </DialogTitle>
    <DialogContent sx={{ pt: 0.5, pb: 2 }}>
      <Typography fontSize="0.875rem" color="text.secondary">
        ¿Estás seguro que deseas cerrar tu sesión? Tendrás que volver a ingresar tus credenciales.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
      <Button variant="outlined" onClick={onCancel} fullWidth
        sx={{ textTransform: "none", borderRadius: "8px", borderColor: "#D1D5DB",
          color: "#374151", fontWeight: 600,
          "&:hover": { borderColor: "#9CA3AF", bgcolor: "rgba(0,0,0,0.02)" } }}>
        Cancelar
      </Button>
      <Button variant="contained" onClick={onConfirm} fullWidth
        sx={{ textTransform: "none", borderRadius: "8px", bgcolor: "#E53935",
          fontWeight: 700, boxShadow: "none",
          "&:hover": { bgcolor: "#C62828", boxShadow: "none" } }}>
        Sí, cerrar sesión
      </Button>
    </DialogActions>
  </Dialog>
);

export default LogoutDialog;