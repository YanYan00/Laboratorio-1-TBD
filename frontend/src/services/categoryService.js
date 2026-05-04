const BASE_URL = "http://localhost:8090/api/categories";

export const getAllCategories = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error al cargar las categorías");
  return res.json();
};
