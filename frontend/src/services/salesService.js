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

export const cancelOrder = async (idPayment, token) => {
    try {
        const response = await fetch(`http://localhost:8090/api/sales/${idPayment}/cancel`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Si el backend responde con error (ej: 403 o 400), lanzamos el mensaje
            const errorText = await response.text();
            throw new Error(errorText || "No se pudo cancelar el pedido");
        }

        return await response.text(); // O response.json() si tu backend devuelve un objeto
    } catch (error) {
        throw error;
    }
};
