const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  listAccounts: () => request("/accounts"),
  createAccount: (payload) =>
    request("/accounts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  deposit: (payload) =>
    request("/transactions/deposit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  withdraw: (payload) =>
    request("/transactions/withdraw", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  transfer: (payload) =>
    request("/transactions/transfer", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};