const API_URL = "http://localhost:5000";

export const apiFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  return res.json();
};