const BASE_URL = "http://localhost:8090/api/sales";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const getMyOrders = async (token) => {
  const res = await fetch(`${BASE_URL}/my-orders`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Error al cargar tus compras");
  return res.json();
};

export const getPurchaseDetail = async (idPayment, token) => {
  const res = await fetch(`${BASE_URL}/${idPayment}/purchase`, {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error("Error al cargar el detalle");
  return res.json();
};
