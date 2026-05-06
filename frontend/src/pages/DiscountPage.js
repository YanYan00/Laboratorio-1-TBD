import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, TextField, Box, Alert, Avatar } from '@mui/material';
import { Percent as PercentIcon } from '@mui/icons-material';

const DiscountPage = ({ onNavigate }) => {
    const [discountData, setDiscountData] = useState({ id_category: '', percentage: '' });
    const [status, setStatus] = useState({ msg: '', type: 'info' });

    useEffect(() => {
        if (status.type === 'success') {
            const timer = setTimeout(() => {
                onNavigate("home");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [status, onNavigate]);


    const noSpinners = {
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
        },
        '& input[type=number]': {
            '-moz-appearance': 'textfield',
        },
    };

    const handleApplyDiscount = async (e) => {
    e.preventDefault();
    try {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8090/api/products/apply-discount", {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                idCategory: parseInt(discountData.id_category),
                percent: parseFloat(discountData.percentage) 
            })
        });

        if (response.ok) {
            setStatus({ 
                msg: `¡Éxito! Descuento aplicado. Redirigiendo...`, 
                type: 'success' 
            });
        } else {
            setStatus({ msg: 'Error en el servidor. Revisa los logs de IntelliJ.', type: 'error' });
        }
    } catch (error) {
        setStatus({ msg: 'No se pudo conectar con la API.', type: 'error' });
    }
};

    return (
        <Container sx={{ mt: 8 }}>
            <Paper sx={{ p: 4, maxWidth: 450, mx: 'auto', borderRadius: 4 }} elevation={3}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: '#FFD54F', width: 60, height: 60, boxShadow: 2 }}>
                        <PercentIcon sx={{ fontSize: 35, color: '#0D47A1' }} />
                    </Avatar>
                </Box>

                <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 700, color: '#0D47A1' }}>
                    Aplicar Descuento Masivo
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 4 }}>
                    Se actualizarán los precios de todos los productos en la categoría seleccionada[cite: 1].
                </Typography>

                {status.msg && (
                    <Alert severity={status.type} sx={{ mb: 3, borderRadius: 2 }}>
                        {status.msg}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleApplyDiscount} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="ID de Categoría"
                        type="number"
                        placeholder="Ej: 1"
                        sx={noSpinners}
                        value={discountData.id_category}
                        onChange={(e) => setDiscountData({...discountData, id_category: e.target.value})}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Porcentaje de Descuento (%)"
                        type="number"
                        placeholder="15"
                        sx={noSpinners}
                        value={discountData.percentage}
                        onChange={(e) => setDiscountData({...discountData, percentage: e.target.value})}
                        required
                        fullWidth
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        disabled={status.type === 'success'}
                        sx={{ 
                            py: 1.5, 
                            bgcolor: '#1565C0', 
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#0D47A1' }
                        }}
                    >
                        {status.type === 'success' ? 'APLICANDO...' : 'APLICAR AHORA'}
                    </Button>
                    <Button 
                        variant="text" 
                        onClick={() => onNavigate("home")} 
                        sx={{ color: 'text.secondary', fontWeight: 500, textTransform: 'none' }}
                    >
                        VOLVER A LA TIENDA
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default DiscountPage;