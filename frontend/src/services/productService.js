const BASE_URL = "http://localhost:8090/api/products";

export const getAllProducts = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al cargar productos");
  return res.json();
};

export const searchProducts = async (keyword) => {
  const res = await fetch(`${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error("Error en la búsqueda");
  return res.json();
};