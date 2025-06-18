import React, { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { PaginatedProducts } from "../types/PaginatedProducts";
import { useCart } from "../contexts/CartContext";
import AddToCartModal from "./AddToCartModal";
import ImageWithFallback from "./ImageWithFallback";

// Nombre d'articles par page
const PAGE_SIZE = 12;

const ProductListPaginated: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modale "ajout au panier"
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { refreshCart } = useCart();

const handleAddToCart = (product: Product, quantity: number) => {
  fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ product, quantity }),
  })
    .then(res => res.json())
    .then(() => {
      refreshCart();
      setModalOpen(false);
    })
    .catch(err => {
      alert('Erreur lors de l\'ajout au panier : ' + err.message);
    });
};


  // Récupère les produits paginés à chaque changement de page
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/product/paginated?page=${page}&size=${PAGE_SIZE}`, {
      headers: { "Cache-Control": "no-cache" }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur API " + res.status);
        return res.json();
      })
      .then((data: PaginatedProducts) => {
        setProducts(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(err => {
        setError(err.message);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [page]);

  // Skeleton loading
  const renderSkeletons = () =>
    Array.from({ length: PAGE_SIZE }).map((_, idx) => (
      <div
        key={idx}
        className="product-card"
        style={{
          background: "#f6f6f6",
          borderRadius: 0,
          padding: 0,
          minHeight: 370,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        <div style={{ width: "100%", height: 320, background: "#eee" }} />
        <div style={{ width: "80%", height: 18, background: "#e2e2e2", margin: "10px 0 0 0" }} />
        <div style={{ width: "50%", height: 15, background: "#ececec" }} />
      </div>
    ));

  return (
    <div style={{ background: "#fff", minHeight: "100vh", paddingBottom: 40 }}>
      <h2 style={{
        textAlign: 'center',
        margin: "38px 0 20px 0",
        fontFamily: "serif",
        letterSpacing: "2px",
        fontWeight: 400,
        fontSize: 34,
      }}>
        NOS PRODUITS
      </h2>
      {loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 36,
          padding: "0 24px"
        }}>
          {renderSkeletons()}
        </div>
      )}
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      {!loading && !error && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 36,
              padding: "0 24px",
            }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  borderRadius: 0,
                  background: "#fff",
                  boxShadow: "none",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  position: "relative",
                  border: "none"
                }}
              >
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 0,
                    height: 320,
                    marginBottom: 12
                  }}>
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    width={260}
                    height={320}
                    style={{
                      width: "100%",
                      height: 320,
                      objectFit: "cover",
                      borderRadius: 0,
                      transition: "transform 0.28s",
                    }}
                  />
                  {/* Effet zoom au survol */}
                  <style>
                    {`
                      .product-card:hover img {
                        transform: scale(1.06);
                        filter: brightness(0.97);
                      }
                    `}
                  </style>
                </div>
                <div style={{
                  padding: 0,
                  textAlign: "center",
                }}>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 400,
                    letterSpacing: ".8px",
                    marginBottom: 4,
                    fontFamily: "serif"
                  }}>
                    {product.name}
                  </div>
                  <div style={{
                    color: "#222",
                    fontSize: 15,
                    marginBottom: 8,
                  }}>
                    {product.price} {product.currency}
                  </div>
                  <button
                    className="add-to-cart-btn"
                    style={{
                      background: "#222",
                      color: "#fff",
                      borderRadius: 0,
                      padding: "10px 32px",
                      border: "none",
                      fontWeight: 400,
                      marginTop: 4,
                      fontSize: 15,
                      letterSpacing: ".5px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background .18s"
                    }}
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalOpen(true);
                    }}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>Aucun produit à afficher.</div>
            )}
          </div>
          {/* Pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 18,
            marginTop: 44,
          }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                padding: "8px 22px",
                borderRadius: 0,
                background: "#f6f6f6",
                border: "none",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
                color: "#333"
              }}
            >
              Précédent
            </button>
            <span style={{ padding: 8, fontSize: 17, fontFamily: "serif" }}>Page {page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              style={{
                padding: "8px 22px",
                borderRadius: 0,
                background: "#f6f6f6",
                border: "none",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
                color: "#333"
              }}
            >
              Suivant
            </button>
          </div>
        </>
      )}

      {/* Modale pour choisir la quantité */}
      <AddToCartModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onAdd={handleAddToCart}
      />
    </div>
  );
};

export default ProductListPaginated;
