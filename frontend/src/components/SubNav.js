import React, { useState } from "react";
import {
  Box, Container, InputBase, Divider, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, TextField, Alert,
} from "@mui/material";
import {
  Search             as SearchIcon,
  HeadsetMicOutlined as HeadsetMicOutlinedIcon,
  MailOutlined       as MailOutlineIcon,
  CheckCircleOutlined as CheckIcon,
} from "@mui/icons-material";

/* ── Modal Soporte ── */
const SupportModal = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
    slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
    <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", pb: 0.5 }}>
      Centro de Soporte
    </DialogTitle>
    <DialogContent>
      <Typography fontSize="0.85rem" color="text.secondary" mb={2}>
        Estamos disponibles para ayudarte de lunes a viernes, de 9:00 a 18:00 hrs.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[
          { label: "📞 Teléfono",  value: "+56 2 2345 6789" },
          { label: "💬 WhatsApp", value: "+56 9 8765 4321" },
          { label: "🕐 Tiempo de respuesta", value: "Menos de 2 horas hábiles" },
          { label: "🌐 Chat en línea", value: "Disponible en la app móvil" },
        ].map((item) => (
          <Box key={item.label} sx={{
            bgcolor: "#F5F7FB", borderRadius: 2, px: 2, py: 1.2,
            border: "1px solid #E3E8F0",
          }}>
            <Typography fontSize="0.75rem" color="text.secondary">{item.label}</Typography>
            <Typography fontSize="0.88rem" fontWeight={600} color="#111827">{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} variant="contained" fullWidth
        sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#1565C0",
          "&:hover": { bgcolor: "#0D47A1" } }}>
        Entendido
      </Button>
    </DialogActions>
  </Dialog>
);

/* ── Modal Contacto ── */
const ContactModal = ({ open, onClose }) => {
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ name: "", email: "", message: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem", pb: 0.5 }}>
        Contáctanos
      </DialogTitle>
      <DialogContent>
        {submitted ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CheckIcon sx={{ fontSize: 48, color: "#43A047", mb: 1.5 }} />
            <Typography fontWeight={700} color="#111827" mb={0.5}>
              ¡Mensaje enviado!
            </Typography>
            <Typography fontSize="0.85rem" color="text.secondary">
              Te responderemos a <strong>{form.email}</strong> en menos de 24 horas hábiles.
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 0.5 }}>
            <TextField size="small" label="Nombre" fullWidth required
              value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <TextField size="small" label="Correo electrónico" type="email" fullWidth required
              value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <TextField size="small" label="Mensaje" multiline rows={3} fullWidth required
              value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <Alert severity="info" sx={{ borderRadius: 2, fontSize: "0.78rem" }}>
              Tiempo de respuesta estimado: <strong>24 horas hábiles</strong>
            </Alert>
            <Button type="submit" variant="contained" fullWidth
              sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#1565C0",
                "&:hover": { bgcolor: "#0D47A1" } }}>
              Enviar mensaje
            </Button>
          </Box>
        )}
      </DialogContent>
      {submitted && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} variant="outlined" fullWidth
            sx={{ textTransform: "none", borderRadius: 2 }}>
            Cerrar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

/* ── SubNav principal ── */
const SubNav = ({ searchValue, onSearchChange }) => {
  const [supportOpen, setSupportOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #E3E8F0" }}>
        <Container maxWidth="xl">
          <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: { xs: 0, md: 1 }, py: 1, gap: 2,
          }}>
            {/* Búsqueda */}
            <Box sx={{
              display: "flex", alignItems: "center",
              bgcolor: "#F5F7FB", borderRadius: 2.5,
              px: 2, py: 0.9, flex: 1,
              border: "1.5px solid #E3E8F0",
              "&:focus-within": { borderColor: "#1565C0", bgcolor: "white",
                boxShadow: "0 0 0 3px rgba(21,101,192,0.08)" },
              transition: "all 0.15s",
            }}>
              <SearchIcon sx={{ fontSize: 20, color: "#9CA3AF", mr: 1.5 }} />
              <InputBase
                placeholder="Buscar productos, categorías o proveedores..."
                value={searchValue}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                sx={{ fontSize: "0.88rem", flex: 1 }}
                inputProps={{ "aria-label": "Buscar productos" }}
              />
            </Box>

            {/* Soporte + Contacto */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", flexShrink: 0 }}>
              <Button
                onClick={() => setSupportOpen(true)}
                startIcon={<HeadsetMicOutlinedIcon sx={{ fontSize: "1rem !important" }} />}
                sx={{ color: "#374151", textTransform: "none", fontSize: "0.8rem",
                  fontWeight: 500, px: 1.5, whiteSpace: "nowrap",
                  "&:hover": { color: "#1565C0", bgcolor: "rgba(21,101,192,0.05)" } }}>
                Soporte
              </Button>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: "#E3E8F0" }} />
              <Button
                onClick={() => setContactOpen(true)}
                startIcon={<MailOutlineIcon sx={{ fontSize: "1rem !important" }} />}
                sx={{ color: "#374151", textTransform: "none", fontSize: "0.8rem",
                  fontWeight: 500, px: 1.5, whiteSpace: "nowrap",
                  "&:hover": { color: "#1565C0", bgcolor: "rgba(21,101,192,0.05)" } }}>
                Contacto
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <SupportModal open={supportOpen} onClose={() => setSupportOpen(false)} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default SubNav;