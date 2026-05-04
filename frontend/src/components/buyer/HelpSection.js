import React, { useState } from "react";
import {
  Box, Typography, Divider, Accordion, AccordionSummary,
  AccordionDetails, Button, TextField, Alert,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  HeadsetMicOutlined as SupportIcon,
  MailOutlined as MailIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";

const FAQS = [
  { q: "¿Cómo puedo hacer seguimiento a mi pedido?", a: "Ingresa a 'Mis compras' y haz click en el pedido para ver su estado actualizado en tiempo real." },
  { q: "¿Cuáles son los métodos de pago disponibles?", a: "Aceptamos transferencia bancaria, tarjeta de crédito empresarial y facturación a 30/60 días para clientes con crédito aprobado." },
  { q: "¿Cómo solicito una factura?", a: "Todas las compras generan factura electrónica automáticamente al RUT registrado en tu cuenta." },
  { q: "¿Puedo modificar o cancelar un pedido?", a: "Puedes cancelar un pedido dentro de las primeras 2 horas desde su confirmación. Para modificaciones, contacta a soporte." },
  { q: "¿Cuáles son los plazos de entrega?", a: "Región Metropolitana: 2-3 días hábiles. Regiones: 4-7 días hábiles. Zonas extremas: consultar." },
];

const HelpSection = () => {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} color="#111827" fontSize="1.05rem">
          Centro de ayuda
        </Typography>
        <Typography variant="body2" color="text.secondary" fontSize="0.82rem">
          Preguntas frecuentes y canales de contacto
        </Typography>
      </Box>
      <Divider sx={{ mb: 3, borderColor: "#E3E8F0" }} />

      {/* Contacto rápido */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2, mb: 4 }}>
        {[
          { icon: <SupportIcon />, label: "Soporte", sub: "Lun–Vie 9:00–18:00", color: "#1565C0" },
          { icon: <MailIcon />,    label: "Email",   sub: "soporte@nextrade.cl", color: "#43A047" },
          { icon: <WhatsAppIcon />, label: "WhatsApp", sub: "+56 9 8765 4321", color: "#25D366" },
        ].map((c) => (
          <Box key={c.label} sx={{ border: "1px solid #E3E8F0", borderRadius: 2.5, p: 2, textAlign: "center",
            cursor: "pointer", transition: "all 0.15s", "&:hover": { borderColor: c.color, boxShadow: `0 2px 12px ${c.color}18` } }}>
            {React.cloneElement(c.icon, { sx: { fontSize: 28, color: c.color, mb: 0.5 } })}
            <Typography fontWeight={700} fontSize="0.85rem" color="#111827">{c.label}</Typography>
            <Typography fontSize="0.72rem" color="text.secondary">{c.sub}</Typography>
          </Box>
        ))}
      </Box>

      {/* FAQs */}
      <Typography fontWeight={700} fontSize="0.9rem" color="#374151" sx={{ mb: 1.5 }}>
        Preguntas frecuentes
      </Typography>
      {FAQS.map((faq, i) => (
        <Accordion key={i} elevation={0} disableGutters
          sx={{ border: "1px solid #E3E8F0", mb: 1, borderRadius: "10px !important",
            "&:before": { display: "none" }, "&.Mui-expanded": { borderColor: "#1565C0" } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#6B7280" }} />}
            sx={{ px: 2.5, py: 0.5, minHeight: 48, "& .MuiAccordionSummary-content": { my: 1 } }}>
            <Typography fontSize="0.85rem" fontWeight={600} color="#111827">{faq.q}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2.5, pb: 2, pt: 0 }}>
            <Typography fontSize="0.82rem" color="text.secondary" lineHeight={1.6}>{faq.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Formulario de contacto */}
      <Box sx={{ mt: 4, p: 3, bgcolor: "#F0F4FF", borderRadius: 3, border: "1px solid #D1DBF0" }}>
        <Typography fontWeight={700} fontSize="0.9rem" color="#1565C0" sx={{ mb: 0.5 }}>
          ¿No encontraste lo que buscabas?
        </Typography>
        <Typography fontSize="0.8rem" color="text.secondary" sx={{ mb: 2 }}>
          Escríbenos y te responderemos a la brevedad.
        </Typography>
        {sent && <Alert severity="success" sx={{ mb: 2, borderRadius: 2, fontSize: "0.8rem" }}>Mensaje enviado. Te responderemos pronto.</Alert>}
        <TextField fullWidth multiline rows={3} placeholder="Describe tu consulta..."
          value={message} onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { bgcolor: "white", borderRadius: 2, fontSize: "0.85rem",
            "&.Mui-focused fieldset": { borderColor: "#1565C0" } } }} />
        <Button variant="contained" onClick={handleSend} disabled={!message.trim()}
          sx={{ bgcolor: "#1565C0", textTransform: "none", fontWeight: 600, borderRadius: 2,
            boxShadow: "none", "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" },
            "&.Mui-disabled": { bgcolor: "#B0BEC5", color: "white" } }}>
          Enviar mensaje
        </Button>
      </Box>
    </Box>
  );
};

export default HelpSection;