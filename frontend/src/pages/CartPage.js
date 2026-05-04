import React from "react";
import {
  Box, Container, Typography, Button, Divider,
  IconButton, Avatar, Stack, Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutlined as DeleteIcon,
  ShoppingCartOutlined as CartIcon,
  ArrowBack as ArrowBackIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";

const CartPage = ({ onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">

        {/* Volver */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => onNavigate("home")}
            sx={{ textTransform: "none", color: "#6B7280", fontSize: "0.85rem", p: 0,
              "&:hover": { bgcolor: "transparent", color: "#1565C0" } }}>
            Volver al catálogo
          </Button>
        </Box>

        <Typography variant="h5" fontWeight={700} color="#111827" sx={{ mb: 3 }}>
          Carrito de compras
          {totalItems > 0 && (
            <Typography component="span"
              sx={{ ml: 1.5, fontSize: "0.9rem", color: "#6B7280", fontWeight: 400 }}>
              ({totalItems} {totalItems === 1 ? "producto" : "productos"})
            </Typography>
          )}
        </Typography>

        {/* Vacío */}
        {cartItems.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 10, gap: 2 }}>
            <CartIcon sx={{ fontSize: 80, color: "#D1DBF0" }} />
            <Typography fontWeight={700} fontSize="1.2rem" color="#374151">
              Tu carrito está vacío
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Agrega productos desde el catálogo para comenzar
            </Typography>
            <Button variant="contained" onClick={() => onNavigate("home")}
              sx={{ mt: 2, bgcolor: "#1565C0", textTransform: "none", fontWeight: 600,
                borderRadius: 2, boxShadow: "none", "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" } }}>
              Ir al catálogo
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 340px" },
            gap: 3, alignItems: "flex-start" }}>

            {/* Lista */}
            <Stack spacing={2}>
              {cartItems.map((item) => (
                <Paper key={item.id} elevation={0}
                  sx={{ border: "1px solid #E3E8F0", borderRadius: 3, p: 2, display: "flex", gap: 2 }}>

                  <Avatar src={item.image} variant="rounded"
                    sx={{ width: 90, height: 90, borderRadius: 2, flexShrink: 0 }} />

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontSize="0.88rem" fontWeight={600} color="#111827" sx={{ mb: 0.25 }}>
                      {item.name}
                    </Typography>
                    <Typography fontSize="0.75rem" color="text.secondary" sx={{ mb: 0.25 }}>
                      SKU: {item.SKUProduct ?? "N/A"}
                    </Typography>
                    <Typography fontSize="0.75rem" color="text.secondary" sx={{ mb: 1 }}>
                      Stock disponible: {item.stock}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center",
                      justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>

                      {/* Cantidad */}
                      <Box sx={{ display: "flex", alignItems: "center",
                        border: "1px solid #E3E8F0", borderRadius: 2, overflow: "hidden" }}>
                        <IconButton size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          sx={{ borderRadius: 0, px: 1, "&:hover": { bgcolor: "#F0F4FF" } }}>
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <Typography sx={{ px: 2, fontSize: "0.9rem", fontWeight: 600, userSelect: "none" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.stock > 0 && item.quantity >= item.stock}
                          sx={{ borderRadius: 0, px: 1, "&:hover": { bgcolor: "#F0F4FF" } }}>
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>

                      {/* Precio */}
                      <Box sx={{ textAlign: "right" }}>
                        <Typography fontSize="0.72rem" color="text.secondary">
                          ${item.price.toLocaleString("es-CL")} x {item.quantity}
                        </Typography>
                        <Typography fontSize="1rem" fontWeight={700} color="#1565C0">
                          ${(item.price * item.quantity).toLocaleString("es-CL")}
                        </Typography>
                      </Box>

                      <IconButton onClick={() => removeFromCart(item.id)} aria-label="Eliminar"
                        sx={{ color: "#9CA3AF",
                          "&:hover": { color: "#E53935", bgcolor: "rgba(229,57,53,0.06)" } }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              ))}

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={clearCart}
                  sx={{ textTransform: "none", color: "#E53935", fontSize: "0.82rem",
                    "&:hover": { bgcolor: "rgba(229,57,53,0.06)" } }}>
                  Vaciar carrito
                </Button>
              </Box>
            </Stack>

            {/* Resumen */}
            <Paper elevation={0} sx={{ border: "1px solid #E3E8F0", borderRadius: 3, p: 3,
              position: { md: "sticky" }, top: { md: 24 } }}>
              <Typography fontWeight={700} fontSize="1rem" color="#111827" sx={{ mb: 2 }}>
                Resumen del pedido
              </Typography>

              <Stack spacing={1} sx={{ mb: 2 }}>
                {cartItems.map((item) => (
                  <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Typography fontSize="0.8rem" color="text.secondary"
                      sx={{ overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap", maxWidth: "65%" }}>
                      {item.name} x{item.quantity}
                    </Typography>
                    <Typography fontSize="0.8rem" fontWeight={600}>
                      ${(item.price * item.quantity).toLocaleString("es-CL")}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ borderColor: "#E3E8F0", mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography fontSize="0.85rem" color="text.secondary">Subtotal</Typography>
                <Typography fontSize="0.85rem" fontWeight={600}>
                  ${totalPrice.toLocaleString("es-CL")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography fontSize="0.85rem" color="text.secondary">Envío</Typography>
                <Typography fontSize="0.85rem" color="#43A047" fontWeight={600}>
                  Por cotizar
                </Typography>
              </Box>

              <Divider sx={{ borderColor: "#E3E8F0", mb: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography fontWeight={700} fontSize="1rem">Total</Typography>
                <Typography fontWeight={700} fontSize="1.1rem" color="#1565C0">
                  ${totalPrice.toLocaleString("es-CL")}
                </Typography>
              </Box>

              <Button fullWidth variant="contained" startIcon={<CreditCardIcon />}
                onClick={() => onNavigate("checkout")}
                sx={{ bgcolor: "#1565C0", textTransform: "none", fontWeight: 700,
                  fontSize: "0.95rem", py: 1.3, borderRadius: 2, boxShadow: "none",
                  "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" } }}>
                Proceder al pago
              </Button>
            </Paper>

          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;