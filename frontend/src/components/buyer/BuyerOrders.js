import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Chip, Divider, Button,
  CircularProgress, Alert, Collapse,
} from "@mui/material";
import {
  ShoppingBagOutlined as BagIcon,
  ReceiptLongOutlined as ReceiptIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders, getPurchaseDetail } from "../../services/salesService";

const STATUS_MAP = {
  PENDING:   { label: "Pendiente",  color: "warning" },
  APPROVED:  { label: "Aprobado",   color: "success" },
  CANCELLED: { label: "Cancelado",  color: "error"   },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("es-CL", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const formatPrice = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency", currency: "CLP", maximumFractionDigits: 0,
  }).format(n);

const OrderDetail = ({ idPayment, token }) => {
  const [detail, setDetail]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getPurchaseDetail(idPayment, token)
      .then(setDetail)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [idPayment, token]);

  if (loading) return <Box sx={{ py: 1, pl: 1 }}><CircularProgress size={16} /></Box>;
  if (error)   return <Typography fontSize="0.78rem" color="error" sx={{ pl: 1 }}>{error}</Typography>;

  return (
    <Box sx={{ mt: 1.5, bgcolor: "#F8FAFC", borderRadius: 1.5, p: 2 }}>
      {detail.map((item, i) => (
        <Box key={i} sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          py: 0.75,
          borderBottom: i < detail.length - 1 ? "1px solid #E3E8F0" : "none",
        }}>
          <Box>
            <Typography fontSize="0.82rem" fontWeight={600} color="#111827">
              {item.product_name}
            </Typography>
            <Typography fontSize="0.72rem" color="text.secondary">
              {item.quantity} × {formatPrice(item.unit_price)}
            </Typography>
          </Box>
          <Typography fontSize="0.85rem" fontWeight={700} color="#1565C0">
            {formatPrice(item.total_paid)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

const BuyerOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMyOrders(token)
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
      <CircularProgress sx={{ color: "#1565C0" }} />
    </Box>
  );

  if (error) return (
    <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
  );

  if (orders.length === 0) return (
    <Box sx={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 320, textAlign: "center", px: 2,
    }}>
      <BagIcon sx={{ fontSize: 52, color: "#D1D5DB", mb: 2 }} />
      <Typography fontWeight={700} color="#374151" mb={1}>No tienes compras aún</Typography>
      <Typography fontSize="0.875rem" color="text.secondary">
        Explora el catálogo y realiza tu primer pedido.
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Typography fontWeight={700} fontSize="1rem" color="#111827" mb={2.5}>
        Mis compras
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {orders.map((order) => {
          const status     = STATUS_MAP[order.status] ?? { label: order.status, color: "default" };
          const isExpanded = expanded === order.idPayment;

          return (
            <Paper key={order.idPayment} elevation={0} sx={{
              border: "1px solid #E3E8F0", borderRadius: 2.5, p: 2.5,
              transition: "all 0.2s",
              "&:hover": { boxShadow: "0 4px 16px rgba(21,101,192,0.08)", borderColor: "#C7D7F0" },
            }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <ReceiptIcon sx={{ color: "#1565C0", fontSize: 22 }} />
                  <Box>
                    <Typography fontWeight={700} fontSize="0.9rem" color="#111827">
                      Orden #{order.idPayment}
                    </Typography>
                    <Typography fontSize="0.75rem" color="text.secondary">
                      {formatDate(order.paymentDate)} · {order.paymentMethod}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip label={status.label} color={status.color} size="small"
                    sx={{ fontWeight: 700, fontSize: "0.72rem", height: 24 }} />
                  <Typography fontWeight={700} fontSize="0.95rem" color="#1565C0">
                    {formatPrice(order.total)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1.5, borderColor: "#F3F4F6" }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button size="small" variant="outlined"
                  endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setExpanded(isExpanded ? null : order.idPayment)}
                  sx={{
                    textTransform: "none", fontSize: "0.8rem", borderRadius: "8px",
                    borderColor: "#D1D5DB", color: "#374151",
                    "&:hover": { borderColor: "#1565C0", color: "#1565C0", bgcolor: "rgba(21,101,192,0.04)" },
                  }}>
                  {isExpanded ? "Ocultar detalle" : "Ver detalle"}
                </Button>
              </Box>

              <Collapse in={isExpanded}>
                {isExpanded && <OrderDetail idPayment={order.idPayment} token={token} />}
              </Collapse>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default BuyerOrders;