import React, { useState } from "react";
import {
  Box, Container, Paper, Typography, TextField,
  Button, InputAdornment, Divider, Alert, CircularProgress,
} from "@mui/material";
import {
  PersonOutlined as PersonIcon,
  EmailOutlined as EmailIcon,
  BadgeOutlined as BadgeIcon,
  HomeOutlined as HomeIcon,
  PhoneOutlined as PhoneIcon,
  AccountCircleOutlined as UsernameIcon,
  LockOutlined as LockIcon,
  CheckCircleOutlined as CheckIcon,
  Visibility, VisibilityOff,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { registerUser } from "../services/authService";

const formatRut = (value) => {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length <= 1) return clean;
  const body = clean.slice(0, -1);
  const dv   = clean.slice(-1);
  return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
};

const validateRut = (rut) => {
  const clean = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length < 2) return false;
  const body = clean.slice(0, -1);
  const dv   = clean.slice(-1);
  let sum = 0, mult = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const exp = 11 - (sum % 11);
  const dvExp = exp === 11 ? "0" : exp === 10 ? "K" : String(exp);
  return dv === dvExp;
};

const validators = {
  username:        (v) => v.trim().length >= 3 ? "" : "Mínimo 3 caracteres",
  name:            (v) => v.trim().length >= 3 ? "" : "Ingresa tu nombre completo",
  email:           (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Formato inválido",
  rut:             (v) => {
    if (!/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(v)) return "Formato inválido (ej: 12.345.678-9)";
    if (!validateRut(v)) return "RUT inválido";
    return "";
  },
  address:         (v) => v.trim().length >= 5 ? "" : "Ingresa una dirección válida",
  phone:           (v) => /^\+\d{8,12}$/.test(v) ? "" : "Formato: +56912345678",
  password:        (v) => v.length >= 8 ? "" : "Mínimo 8 caracteres",
  confirmPassword: (v, form) => v === form.password ? "" : "Las contraseñas no coinciden",
};

const FIELDS = [
  { name: "username",        label: "Nombre de usuario",   icon: <UsernameIcon />, type: "text",     placeholder: "ej: empresa_chile" },
  { name: "name",            label: "Nombre completo",     icon: <PersonIcon />,   type: "text",     placeholder: "ej: Juan Pérez González" },
  { name: "email",           label: "Correo electrónico",  icon: <EmailIcon />,    type: "email",    placeholder: "ej: contacto@empresa.cl" },
  { name: "rut",             label: "RUT",                 icon: <BadgeIcon />,    type: "text",     placeholder: "ej: 12.345.678-9" },
  { name: "address",         label: "Dirección",           icon: <HomeIcon />,     type: "text",     placeholder: "ej: Av. Libertador 1234, Santiago" },
  { name: "phone",           label: "Teléfono",            icon: <PhoneIcon />,    type: "tel",      placeholder: "ej: +56912345678" },
  { name: "password",        label: "Contraseña",          icon: <LockIcon />,     type: "password", placeholder: "Mínimo 8 caracteres" },
  { name: "confirmPassword", label: "Confirmar contraseña",icon: <LockIcon />,     type: "password", placeholder: "Repite tu contraseña" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", fontSize: "0.88rem", bgcolor: "white",
    "&.Mui-focused fieldset": { borderColor: "#1565C0" },
    "&:hover fieldset": { borderColor: "#1565C0" },
  },
  "& .MuiFormHelperText-root": { fontSize: "0.72rem", mx: 0, mt: 0.5 },
};

const RegisterPage = ({ onNavigate }) => {
  const [form, setForm]         = useState({ username:"", name:"", email:"", rut:"", address:"", phone:"", password:"", confirmPassword:"" });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPwd, setShowPwd]   = useState({ password: false, confirmPassword: false });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "rut") value = formatRut(value);
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validators[name](value, { ...form, [name]: value }) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validators[name](value, form) }));
  };

  const isFormValid = () => FIELDS.every((f) => !validators[f.name](form[f.name], form));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.name, true]));
    const allErrors  = Object.fromEntries(FIELDS.map((f) => [f.name, validators[f.name](form[f.name], form)]));
    setTouched(allTouched);
    setErrors(allErrors);
    if (!isFormValid()) return;

    setLoading(true);
    setApiError("");
    try {
      await registerUser(form);
      setSuccess(true);
    } catch (err) {
      setApiError(err.message || "Error al registrar. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const togglePwd = (field) => setShowPwd((p) => ({ ...p, [field]: !p[field] }));

  if (success) {
    return (
      <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
        <Paper elevation={0} sx={{ border: "1px solid #E3E8F0", borderRadius: 3, p: 6, maxWidth: 420, width: "100%", textAlign: "center" }}>
          <CheckIcon sx={{ fontSize: 64, color: "#43A047", mb: 2 }} />
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>¡Registro exitoso!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Tu cuenta ha sido creada. Ya puedes iniciar sesión.</Typography>
          <Button variant="contained" fullWidth onClick={() => onNavigate("login")}
            sx={{ bgcolor: "#1565C0", textTransform: "none", fontWeight: 600, py: 1.2, borderRadius: 2, boxShadow: "none",
              "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" } }}>
            Ir a iniciar sesión
          </Button>
        </Paper>
      </Box>
    );
  }

  const iconColor = (name) =>
    touched[name] && errors[name] ? "#d32f2f" : touched[name] && !errors[name] ? "#43A047" : "#9CA3AF";

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 2 }}>
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="#1565C0" />
              <path d="M8 10 L16 18 L8 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 10 H28 V18 H16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="26" r="2.5" fill="white" />
              <circle cx="28" cy="26" r="2.5" fill="white" />
            </svg>
            <Typography variant="h6" fontWeight={700} color="#1565C0">
              Nex<span style={{ fontWeight: 300 }}>Trade</span>
            </Typography>
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#111827", mb: 0.5 }}>Crear cuenta empresarial</Typography>
          <Typography variant="body2" color="text.secondary">Completa tus datos para acceder a la plataforma B2B</Typography>
        </Box>

        <Paper elevation={0} sx={{ border: "1px solid #E3E8F0", borderRadius: 3, p: { xs: 3, sm: 4 }, boxShadow: "0 4px 20px rgba(21,101,192,0.07)" }}>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.82rem" }} onClose={() => setApiError("")}>
              {apiError}
            </Alert>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {FIELDS.map((field) => {
                const isPassword = field.type === "password";
                const show = showPwd[field.name];
                return (
                  <Box key={field.name}>
                    <Typography variant="caption" fontWeight={600}
                      sx={{ color: "#374151", mb: 0.5, display: "block", fontSize: "0.8rem" }}>
                      {field.label}
                    </Typography>
                    <TextField
                      fullWidth size="small"
                      name={field.name}
                      type={isPassword ? (show ? "text" : "password") : field.type}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched[field.name] && Boolean(errors[field.name])}
                      helperText={touched[field.name] && errors[field.name]}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {React.cloneElement(field.icon, { sx: { fontSize: 18, color: iconColor(field.name) } })}
                          </InputAdornment>
                        ),
                        ...(isPassword && {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={() => togglePwd(field.name)} edge="end">
                                {show ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }),
                      }}
                      sx={fieldSx}
                    />
                  </Box>
                );
              })}

              <Divider sx={{ my: 0.5, borderColor: "#E3E8F0" }} />

              <Button type="submit" variant="contained" fullWidth disabled={loading}
                sx={{ bgcolor: "#1565C0", textTransform: "none", fontWeight: 700, fontSize: "0.95rem",
                  py: 1.3, borderRadius: "8px", boxShadow: "none",
                  "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" },
                  "&.Mui-disabled": { bgcolor: "#B0BEC5", color: "white" } }}>
                {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Crear cuenta"}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" fontSize="0.8rem">
                  ¿Ya tienes cuenta?{" "}
                  <Button onClick={() => onNavigate("login")}
                    sx={{ textTransform: "none", color: "#1565C0", fontWeight: 600, fontSize: "0.8rem", p: 0, minWidth: 0,
                      "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
                    Iniciar sesión
                  </Button>
                </Typography>
              </Box>
            </Box>
          </form>
        </Paper>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button onClick={() => onNavigate("home")}
            sx={{ textTransform: "none", color: "#6B7280", fontSize: "0.8rem",
              "&:hover": { bgcolor: "transparent", color: "#1565C0" } }}>
            ← Volver al inicio
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;