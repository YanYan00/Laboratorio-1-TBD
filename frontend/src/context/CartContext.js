import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const normalizeProduct = (product) => ({
    id: product.id ?? product.id_product,
    id_product: product.id_product ?? product.id,
    name: product.name ?? product.productName ?? "Producto sin nombre",
    description: product.description ?? product.productDescription ?? "",
    price: Number(product.price ?? product.productPrice ?? 0),
    stock: Number(product.stock ?? 0),
    image:
      product.image ||
      `https://picsum.photos/seed/product-${product.id_product ?? product.id}/400/300`,
    category: product.category ?? product.category_name ?? "Producto",
    quantity: Number(product.quantity ?? 1),
    SKUProduct: product.SKUProduct ?? null,
    id_category: product.id_category ?? null,
  });

  const addToCart = (product, quantity = 1) => {
    const normalized = normalizeProduct(product);
    const qty = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === normalized.id);

      if (existing) {
        const nextQty = Math.min(existing.quantity + qty, existing.stock || Infinity);
        return prev.map((i) =>
          i.id === normalized.id ? { ...i, quantity: nextQty } : i
        );
      }

      return [
        ...prev,
        {
          ...normalized,
          quantity: Math.min(qty, normalized.stock || qty),
        },
      ];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id, quantity) => {
    const qty = Number(quantity);
    if (qty < 1) return removeFromCart(id);

    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(qty, i.stock || qty) } : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);