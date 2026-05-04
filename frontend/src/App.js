import React, { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import SubNav from "./components/SubNav";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import BuyerPage from "./pages/BuyerPage";

const theme = createTheme({
  palette: { primary: { main: "#1565C0" }, background: { default: "#F5F7FB" } },
  typography: { fontFamily: "'Inter', 'Roboto', sans-serif" },
  shape: { borderRadius: 8 },
});

// Componente interno — puede usar useAuth porque está dentro de AuthProvider
const AppContent = () => {
  const [page, setPage] = useState("home");
  const { isAuthenticated, logout } = useAuth();

  const handleNavigate = (target) => {
    if (target === "home" && !isAuthenticated) {
      logout(); // limpia sesión si va a home sin auth (desde logout sidebar)
    }
    setPage(target);
  };

  const handleLogout = () => {
    logout();
    setPage("home");
  };

  const renderPage = () => {
    switch (page) {
      case "register": return <RegisterPage onNavigate={setPage} />;
      case "login":    return <LoginPage onNavigate={setPage} />;
      case "cart":     return <CartPage onNavigate={setPage} />;
      case "buyer":    return <BuyerPage onNavigate={setPage} onLogout={handleLogout} />;
      default:         return <HomePage onNavigate={setPage} />;
    }
  };

  const isBuyer  = page === "buyer";
  const showHeader = !isBuyer; // BuyerPage tiene su propio header
  const headerMode = isAuthenticated ? "buyer" : "guest";

  return (
    <>
      {showHeader && (
        <Header
          onNavigate={setPage}
          mode={headerMode}
          onLogout={handleLogout}
        />
      )}
      {showHeader && page === "home" && <SubNav />}
      {renderPage()}
    </>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;