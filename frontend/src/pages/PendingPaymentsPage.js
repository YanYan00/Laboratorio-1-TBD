import React, { useState, useEffect } from "react";
import { 
  Container, Paper, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Button, Box, Alert, Avatar 
} from "@mui/material";
import { Payments as PaymentsIcon } from "@mui/icons-material";

const PendingPaymentsPage = ({ onNavigate }) => {
  const [pendingSales, setPendingSales] = useState([]);
  const [error, setError] = useState(null);

  const fetchPendingSales = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8090/api/sales/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingSales(data);
      } else {
        setError("No tienes permisos suficientes.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  useEffect(() => { fetchPendingSales(); }, []);

  const handleApprove = async (paymentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8090/api/sales/${paymentId}/approve`, {
        method: 'PATCH', 
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert("¡Venta aprobada con éxito!");
        fetchPendingSales();
      } else {
        setError("No se pudo procesar la aprobación.");
      }
    } catch (err) {
      setError("Error de red.");
    }
  };

  const handleCancel = async (id_payment) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8090/api/sales/${id_payment}/cancel`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert("Pedido cancelado.");
        fetchPendingSales();
      } else {
        setError("No se pudo cancelar el pedido.");
      }
    } catch (err) {
      setError("Error de red.");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar sx={{ bgcolor: "#d32f2f", mx: "auto", mb: 1 }}><PaymentsIcon /></Avatar>
          <Typography variant="h5" fontWeight={700} color="#d32f2f">Pagos Pendientes</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID Pago</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Comprador</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingSales.map((sale) => {
                const idPayment = sale.id_payment || sale.idPayment;
                const total = sale.total_amount || sale.totalAmount || 0;
                const fecha = sale.sale_date || sale.saleDate || sale.date;
                const nombreCliente = sale.username || sale.name || `Usuario (ID: ${sale.id_user || sale.idUser})`;

                return (
                  <TableRow key={idPayment}>
                    <TableCell>#{idPayment}</TableCell>
                    <TableCell>{fecha ? new Date(fecha).toLocaleDateString("es-CL") : "Sin Fecha"}</TableCell>
                    <TableCell><strong>${Number(total).toLocaleString("es-CL")}</strong></TableCell>
                    <TableCell>{nombreCliente}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button 
                          variant="contained" 
                          color="success"
                          size="small"
                          onClick={() => handleApprove(idPayment)}
                          disabled={!idPayment}
                        >
                          Confirmar
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error"
                          size="small"
                          onClick={() => handleCancel(idPayment)}
                          disabled={!idPayment}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button 
            variant="text"
            onClick={() => onNavigate("home")} 
            sx={{ fontWeight: 600, color: 'text.secondary' }}
          >
            VOLVER AL HOME
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default PendingPaymentsPage;