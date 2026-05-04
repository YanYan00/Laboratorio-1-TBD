const BASE_URL = "http://localhost:8090/api/auth";

export const registerUser = async (formData) => {
  const body = {
    username:        formData.username,
    password:        formData.password,
    confirmPassword: formData.confirmPassword,
    email:           formData.email,
    name_user:       formData.name,
    rut:             formData.rut,
    address:         formData.address,
    phone:           formData.phone,
  };
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text;
};

export const loginUser = async (identifier, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text);
  return text; // JWT token
};