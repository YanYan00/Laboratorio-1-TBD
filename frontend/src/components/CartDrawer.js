import React, { useState } from "react";
import {
  Drawer, Box, Typography, IconButton, Button,
  Avatar, Stack, FormControl, RadioGroup, 
  FormControlLabel, Radio, Paper, CircularProgress,
  Divider 
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCartOutlined as CartIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  CheckCircleOutlined as SuccessIcon
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartDrawer = ({ open, onClose, onNavigate, fetchProducts }) => {
  const { cartItems, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CARD");

  const handleCheckout = async () => {
    if (cartItems.length === 0 || loading) return;

    setLoading(true);
    try {
      const tokenActual = localStorage.getItem("token") || token;
      
      const formattedCart = cartItems.map(item => ({
        id_product: item.id, 
        quantity: item.quantity,
        id_user: user?.id_user
      }));

      const response = await fetch(`http://localhost:8090/api/sales/checkout?paymentMethod=${paymentMethod}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenActual}`
        },
        body: JSON.stringify(formattedCart)
      });

      if (response.ok) {
        if (typeof fetchProducts === 'function') {
            fetchProducts(); 
        }

        setShowSuccess(true);
        clearCart();

        setTimeout(() => {
            window.location.href = "/"; 
        }, 3000);

      } else {
        const errorData = await response.json().catch(() => ({}));
        alert("Error: " + (errorData.message || "No se pudo procesar la compra"));
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100vw", sm: 400 }, display: "flex", flexDirection: "column" },
      }}
    >
      <Box sx={{ px: 2.5, py: 2, bgcolor: "#1565C0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CartIcon sx={{ color: "white", fontSize: 22 }} />
          <Typography fontWeight={700} sx={{ color: "white", fontSize: "1rem" }}>
            {showSuccess ? "Confirmación" : `Mi Carrito (${totalItems})`}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}><CloseIcon /></IconButton>
      </Box>

      {showSuccess ? (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, textAlign: "center" }}>
          <SuccessIcon sx={{ fontSize: 80, color: "#2E7D32", mb: 2 }} />
          <Typography variant="h5" fontWeight={700} color="#2E7D32" gutterBottom>
            {paymentMethod === "TRANSFER" ? "Pedido Recibido" : "¡Compra Exitosa!"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {paymentMethod === "TRANSFER" 
              ? "Tu pedido está pendiente de validación por el administrador."
              : "El stock ha sido actualizado. Gracias por tu compra."}
          </Typography>
          <CircularProgress size={24} sx={{ mb: 1, color: "#2E7D32" }} />
          <Typography variant="caption" color="text.secondary">
            Sincronizando con el servidor...
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
            {cartItems.length === 0 ? (
              <Typography textAlign="center" sx={{ mt: 10, color: "text.secondary" }}>Tu carrito está vacío</Typography>
            ) : (
              <Stack spacing={2}>
                {cartItems.map((item) => (
                  <Box key={item.id} sx={{ bgcolor: "white", border: "1px solid #E3E8F0", borderRadius: 2, p: 1.5, display: "flex", gap: 1.5 }}>
                    <Avatar src={item.image} variant="rounded" sx={{ width: 60, height: 60 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontSize="0.85rem" fontWeight={600} noWrap>{item.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                        <Typography fontSize="0.9rem" fontWeight={700} color="#1565C0">
                            ${(item.price * item.quantity).toLocaleString("es-CL")}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #E3E8F0", borderRadius: 1 }}>
                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}><RemoveIcon sx={{ fontSize: 14 }} /></IconButton>
                            <Typography sx={{ px: 1, fontSize: "0.8rem" }}>{item.quantity}</Typography>
                            <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}><AddIcon sx={{ fontSize: 14 }} /></IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {cartItems.length > 0 && (
            <Box sx={{ p: 2.5, bgcolor: "#F8FAFC", borderTop: "1px solid #E3E8F0" }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Método de Pago:</Typography>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel value="CARD" control={<Radio size="small" />} label="Tarjeta (Instantáneo)" />
                <FormControlLabel value="TRANSFER" control={<Radio size="small" />} label="Transferencia (Pendiente)" />
              </RadioGroup>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography fontWeight={600}>Total:</Typography>
                <Typography fontWeight={800} color="#1565C0">${totalPrice.toLocaleString("es-CL")}</Typography>
              </Box>
              <Button 
                fullWidth 
                variant="contained" 
                disabled={loading} 
                onClick={handleCheckout}
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "FINALIZAR PEDIDO"}
              </Button>
            </Box>
          )}
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;