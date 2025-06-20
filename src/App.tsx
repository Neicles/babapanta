import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CartIcon from "./components/CartIcon";
import ProductListPaginated from "./components/ProductListPaginated";
import DrawerPanier from "./components/DrawerPanier";
import CheckoutPage from "./pages/CheckoutPage";

const ZaraHeader = () => (
  <header
    style={{
      paddingTop: 36,
      paddingBottom: 30,
      background: "#fff",
      textAlign: "center",
      borderBottom: "1.5px solid #eee",
      marginBottom: 38,
      letterSpacing: 9,
      fontWeight: 700,
      fontFamily: "Bodoni Moda, Didot, serif",
      fontSize: 39,
      color: "#111",
      textTransform: "uppercase",
      userSelect: "none",
    }}
  >
    BABAPANTA
  </header>
);

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <BrowserRouter>
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        <ZaraHeader />
        <div style={{ position: "fixed", top: 34, right: 44, zIndex: 2000 }}>
          <CartIcon onClick={() => setDrawerOpen(true)} />
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProductListPaginated />
                <DrawerPanier
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  onRequestShipping={() => {
                    setDrawerOpen(false);
                    setTimeout(() => window.location.href = "/checkout", 200);
                  }}
                />
              </>
            }
          />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
