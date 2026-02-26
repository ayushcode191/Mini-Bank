import { useState } from "react";

export default function AccountForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    accountNo: "",
    holderName: "",
    balance: "",
    isKYCVerified: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      balance: form.balance === "" ? 0 : Number(form.balance),
    });
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <label>
        Account Number
        <input
          name="accountNo"
          value={form.accountNo}
          onChange={handleChange}
          required
          placeholder="e.g. 1001"
        />
      </label>

      <label>
        Holder Name
        <input
          name="holderName"
          value={form.holderName}
          onChange={handleChange}
          required
          placeholder="e.g. Rahul Sharma"
        />
      </label>

      <label>
        Initial Balance
        <input
          name="balance"
          type="number"
          min="0"
          value={form.balance}
          onChange={handleChange}
          placeholder="0"
        />
      </label>

      <label className="checkbox-row">
        <input
          name="isKYCVerified"
          type="checkbox"
          checked={form.isKYCVerified}
          onChange={handleChange}
        />
        KYC Verified
      </label>

      <button disabled={loading} type="submit">
        {loading ? "Creating..." : "Create Account"}
      </button>
    </form>
  );
}