import React, { useState } from "react";
import {
  Box, Typography, Paper, TextField, Button,
  Avatar, Divider,
} from "@mui/material";
import { EditOutlined as EditIcon, SaveOutlined as SaveIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", fontSize: "0.875rem",
    "&.Mui-focused fieldset": { borderColor: "#1565C0" },
  },
};

const FIELDS = [
  { label: "Usuario",            name: "username", placeholder: "Tu username",            disabled: true },
  { label: "Correo electrónico", name: "email",    placeholder: "correo@empresa.cl",      disabled: true },
  { label: "Teléfono",           name: "phone",    placeholder: "+56 9 XXXX XXXX" },
  { label: "RUT empresa",        name: "rut",      placeholder: "12.345.678-9" },
  { label: "Dirección",          name: "address",  placeholder: "Av. Ejemplo 123, Santiago" },
];

const BuyerProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || "",
    email:    user?.email    || "",
    phone:    "",
    address:  "",
    rut:      "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <Box>
      <Typography fontWeight={700} fontSize="1rem" color="#111827" mb={2.5}>Mi perfil</Typography>

      <Paper elevation={0} sx={{ border: "1px solid #E3E8F0", borderRadius: 2.5, p: 3, maxWidth: 520 }}>
        {/* Avatar + nombre */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: "#1565C0", fontSize: "1.3rem", fontWeight: 700 }}>
            {initials}
          </Avatar>
          <Box>
            <Typography fontWeight={700} color="#111827">{user?.username}</Typography>
            <Typography fontSize="0.8rem" color="text.secondary">{user?.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "#F3F4F6" }} />

        {/* Campos en columna */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {FIELDS.map((field) => (
            <Box key={field.name}>
              <Typography variant="caption" fontWeight={600}
                sx={{ color: "#374151", mb: 0.5, display: "block", fontSize: "0.78rem" }}>
                {field.label}
              </Typography>
              <TextField fullWidth size="small"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                disabled={!editing || field.disabled}
                placeholder={field.placeholder}
                sx={fieldSx}
              />
              {field.disabled && editing && (
                <Typography fontSize="0.7rem" color="text.secondary" sx={{ mt: 0.3 }}>
                  Este campo no se puede modificar
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1.5 }}>
          {editing ? (
            <>
              <Button variant="outlined" size="small" onClick={() => setEditing(false)}
                sx={{ textTransform: "none", borderRadius: "8px", borderColor: "#D1D5DB", color: "#374151" }}>
                Cancelar
              </Button>
              <Button variant="contained" size="small" startIcon={<SaveIcon />}
                onClick={() => setEditing(false)}
                sx={{ textTransform: "none", borderRadius: "8px", bgcolor: "#1565C0",
                  boxShadow: "none", "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" } }}>
                Guardar cambios
              </Button>
            </>
          ) : (
            <Button variant="outlined" size="small" startIcon={<EditIcon />}
              onClick={() => setEditing(true)}
              sx={{ textTransform: "none", borderRadius: "8px",
                borderColor: "#1565C0", color: "#1565C0",
                "&:hover": { bgcolor: "rgba(21,101,192,0.04)" } }}>
              Editar perfil
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BuyerProfile;