import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AccountCircleOutlined as UsernameIcon,
  LockOutlined as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

const validators = {
  username: (v) => v.trim().length >= 3 ? "" : "Mínimo 3 caracteres",
  password: (v) => v.length >= 6 ? "" : "Mínimo 6 caracteres",
};

const LoginPage = ({ onNavigate }) => {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setLoginError("");
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
  };

  const isValid = () => !validators.username(form.username) && !validators.password(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setErrors({
      username: validators.username(form.username),
      password: validators.password(form.password),
    });
    if (!isValid()) return;

    setLoading(true);
    // Simula llamada al backend
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    // Cuando conectes el backend, reemplaza esto con la respuesta real
    setLoginError("Usuario o contraseña incorrectos.");
  };

  return (
    <Box
      sx={{
        bgcolor: "#F5F7FB",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        {/* Logo + título */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 2 }}>
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="NexTrade">
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
          <Typography variant="h5" fontWeight={700} sx={{ color: "#111827", mb: 0.5 }}>
            Iniciar sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Accede a tu cuenta empresarial B2B
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E3E8F0",
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            boxShadow: "0 4px 20px rgba(21,101,192,0.07)",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

              {/* Error de login */}
              {loginError && (
                <Alert severity="error" sx={{ borderRadius: 2, fontSize: "0.82rem" }}>
                  {loginError}
                </Alert>
              )}

              {/* Username */}
              <Box>
                <Typography variant="caption" fontWeight={600}
                  sx={{ color: "#374151", mb: 0.5, display: "block", fontSize: "0.8rem" }}>
                  Nombre de usuario
                </Typography>
                <TextField
                  fullWidth size="small"
                  name="username"
                  placeholder="ej: empresa_chile"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <UsernameIcon sx={{
                          fontSize: 18,
                          color: touched.username && errors.username ? "#d32f2f"
                            : touched.username && !errors.username ? "#43A047"
                            : "#9CA3AF",
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px", fontSize: "0.88rem", bgcolor: "white",
                      "&.Mui-focused fieldset": { borderColor: "#1565C0" },
                      "&:hover fieldset": { borderColor: "#1565C0" },
                    },
                    "& .MuiFormHelperText-root": { fontSize: "0.72rem", mx: 0, mt: 0.5 },
                  }}
                />
              </Box>

              {/* Contraseña */}
              <Box>
                <Typography variant="caption" fontWeight={600}
                  sx={{ color: "#374151", mb: 0.5, display: "block", fontSize: "0.8rem" }}>
                  Contraseña
                </Typography>
                <TextField
                  fullWidth size="small"
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{
                          fontSize: 18,
                          color: touched.password && errors.password ? "#d32f2f"
                            : touched.password && !errors.password ? "#43A047"
                            : "#9CA3AF",
                        }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPass(!showPass)}
                          aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                          edge="end"
                        >
                          {showPass
                            ? <VisibilityOffIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />
                            : <VisibilityIcon sx={{ fontSize: 18, color: "#9CA3AF" }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px", fontSize: "0.88rem", bgcolor: "white",
                      "&.Mui-focused fieldset": { borderColor: "#1565C0" },
                      "&:hover fieldset": { borderColor: "#1565C0" },
                    },
                    "& .MuiFormHelperText-root": { fontSize: "0.72rem", mx: 0, mt: 0.5 },
                  }}
                />
              </Box>

              <Divider sx={{ borderColor: "#E3E8F0" }} />

              {/* Botón submit */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: "#1565C0",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  py: 1.3,
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#0D47A1", boxShadow: "none" },
                  "&.Mui-disabled": { bgcolor: "#B0BEC5", color: "white" },
                }}
              >
                {loading
                  ? <CircularProgress size={20} sx={{ color: "white" }} />
                  : "Ingresar"}
              </Button>

              {/* Link a registro */}
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" fontSize="0.8rem">
                  ¿No tienes cuenta?{" "}
                  <Button
                    onClick={() => onNavigate && onNavigate("register")}
                    sx={{
                      textTransform: "none", color: "#1565C0", fontWeight: 600,
                      fontSize: "0.8rem", p: 0, minWidth: 0,
                      "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                    }}
                  >
                    Regístrate aquí
                  </Button>
                </Typography>
              </Box>

            </Box>
          </form>
        </Paper>

        {/* Volver al inicio */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            onClick={() => onNavigate && onNavigate("home")}
            sx={{
              textTransform: "none", color: "#6B7280", fontSize: "0.8rem",
              "&:hover": { bgcolor: "transparent", color: "#1565C0" },
            }}
          >
            ← Volver al inicio
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;