import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    api
      .get("/cart", token)
      .then((data) => setItems(data.items))
      .catch(() => setItems([]));
  }, [isAuthenticated, token]);

  const value = useMemo(
    () => ({
      items,
      isCartOpen,
      setIsCartOpen,
      total: items.reduce((sum, item) => sum + Number(item.price_kzt) * item.quantity, 0),
      async addToCart(bookId) {
        const data = await api.post("/cart", { bookId, quantity: 1 }, token);
        setItems(data.items);
        setIsCartOpen(true);
      },
      async removeItem(bookId) {
        const data = await api.delete(`/cart/${bookId}`, token);
        setItems(data.items);
      },
      async checkout(payload) {
        const data = await api.post("/orders", payload, token);
        setItems([]);
        return data;
      }
    }),
    [items, isCartOpen, token]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
