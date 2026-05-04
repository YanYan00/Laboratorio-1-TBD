import React from "react";
import {
  Drawer, Box, Typography, IconButton, Button,
  Divider, Avatar, Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutlined as DeleteIcon,
  ShoppingCartOutlined as CartIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";

const CartDrawer = ({ open, onClose, onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100vw", sm: 400 }, display: "flex", flexDirection: "column" },
      }}
    >
      {/* Header */}
      <Box sx={{
        px: 2.5, py: 2, bgcolor: "#1565C0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CartIcon sx={{ color: "white", fontSize: 22 }} />
          <Typography fontWeight={700} sx={{ color: "white", fontSize: "1rem" }}>
            Carrito {totalItems > 0 && `(${totalItems})`}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar carrito"
          sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.15)" } }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", py: 8, gap: 2 }}>
            <CartIcon sx={{ fontSize: 64, color: "#D1DBF0" }} />
            <Typography fontWeight={600} color="#374151" fontSize="1rem">
              Tu carrito está vacío
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 220 }}>
              Agrega productos desde el catálogo para comenzar tu pedido
            </Typography>
            <Button variant="outlined" onClick={onClose}
              sx={{ mt: 1, textTransform: "none", borderColor: "#1565C0", color: "#1565C0",
                fontWeight: 600, borderRadius: 2, "&:hover": { bgcolor: "rgba(21,101,192,0.05)" } }}>
              Ver catálogo
            </Button>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{
                bgcolor: "white", border: "1px solid #E3E8F0",
                borderRadius: 2, p: 1.5, display: "flex", gap: 1.5,
              }}>
                <Avatar src={item.image} variant="rounded"
                  sx={{ width: 60, height: 60, borderRadius: 1.5, flexShrink: 0 }} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontSize="0.8rem" fontWeight={600} color="#111827"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {item.name}
                  </Typography>
                  <Typography fontSize="0.72rem" color="text.secondary" sx={{ mt: 0.25 }}>
                    SKU: {item.SKUProduct ?? "N/A"}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center",
                    justifyContent: "space-between", mt: 0.75, gap: 1 }}>
                    {/* Cantidad */}
                    <Box sx={{ display: "flex", alignItems: "center",
                      border: "1px solid #E3E8F0", borderRadius: 1.5, overflow: "hidden" }}>
                      <IconButton size="small"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        sx={{ borderRadius: 0, py: 0.25, px: 0.75, "&:hover": { bgcolor: "#F0F4FF" } }}>
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography sx={{ px: 1.5, fontSize: "0.82rem", fontWeight: 600, userSelect: "none" }}>
                        {item.quantity}
                      </Typography>
                      <IconButton size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.stock > 0 && item.quantity >= item.stock}
                        sx={{ borderRadius: 0, py: 0.25, px: 0.75, "&:hover": { bgcolor: "#F0F4FF" } }}>
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>

                    <Typography fontSize="0.88rem" fontWeight={700} color="#1565C0">
                      ${(item.price * item.quantity).toLocaleString("es-CL")}
                    </Typography>

                    <IconButton size="small" onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto"
                      sx={{ color: "#9CA3AF", "&:hover": { color: "#E53935", bgcolor: "rgba(229,57,53,0.06)" } }}>
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* Footer */}
      {cartItems.length > 0 && (
        <Box sx={{ borderTop: "1px solid #E3E8F0", px: 2.5, py: 2.5, bgcolor: "white" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography fontSize="0.85rem" color="text.secondary">
              Subtotal ({totalItems} productos)
            </Typography>
            <Typography fontSize="0.85rem" fontWeight={700} color="#111827">
              ${totalPrice.toLocaleString("es-CL")}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2, borderColor: "#E3E8F0" }} />

          <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />}
            onClick={() => { onClose(); onNavigate("cart"); }}
            sx={{ mb: 1.5, textTransform: "none", fontWeight: 600, fontSize: "0.88rem",
              borderColor: "#1565C0", color: "#1565C0", borderRadius: 2, py: 1,
              "&:hover": { bgcolor: "rgba(21,101,192,0.05)" } }}>
            Ver carrito completo
          </Button>

          <Button fullWidth variant="contained"
            onClick={() => { onClose(); onNavigate("checkout"); }}
            sx={{ bgcolor: "#1565C0", textTransform: "none", fontWeight: 700,
              fontSize: "0.88rem", borderRadius: 2, py: 1, boxShadow: "none",
              "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" } }}>
            Proceder al pago
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default CartDrawer;