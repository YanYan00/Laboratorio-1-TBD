import React, { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import SubNav from "./components/SubNav";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";

const theme = createTheme({
  palette: { primary: { main: "#1565C0" }, background: { default: "#F5F7FB" } },
  typography: { fontFamily: "'Inter', 'Roboto', sans-serif" },
  shape: { borderRadius: 8 },
});

const App = () => {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "register": return <RegisterPage onNavigate={setPage} />;
      case "login":    return <LoginPage onNavigate={setPage} />;
      case "cart":     return <CartPage onNavigate={setPage} />;
      default:         return <HomePage onNavigate={setPage} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        {page === "home" && <Header onNavigate={setPage} />}
        {page === "home" && <SubNav />}
        {renderPage()}
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;