import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import CartIcon from "./components/CartIcon";
import ProductListPaginated from "./components/ProductListPaginated";
import DrawerPanier from "./components/DrawerPanier";
import CheckoutPage from "./pages/CheckoutPage";

const App: React.FC = () => {
  // Tu peux gérer le panier drawer ici seulement pour la page catalogue
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <BrowserRouter>
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        {/* Header et Panier (affiché partout) */}
        <header>{/* ... ton header ... */}</header>
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
                  // On redirige vers /checkout si panier validé
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
