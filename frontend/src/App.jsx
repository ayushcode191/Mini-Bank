import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "./api";
import AccountForm from "./components/AccountForm";
import TransactionPanel from "./components/TransactionPanel";
import AccountList from "./components/AccountList";
import OutputPanel from "./components/OutputPanel";

const now = () => new Date().toLocaleString();

export default function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const totalAccounts = accounts.length;
  const totalKYCVerified = accounts.filter((item) => item.isKYCVerified).length;
  const totalBalance = accounts.reduce((sum, item) => sum + Number(item.balance || 0), 0);

  const addLog = (message, type = "success") => {
    setLogs((prev) => [
      { id: `${Date.now()}-${Math.random()}`, message, type, time: now() },
      ...prev,
    ]);
  };

  const loadAccounts = async () => {
    try {
      const res = await api.listAccounts();
      setAccounts(res.data || []);
    } catch (error) {
      addLog(error.message, "error");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const wrapAction = async (action, successMessage) => {
    setLoading(true);
    try {
      await action();
      addLog(successMessage, "success");
      toast.success(successMessage);
      await loadAccounts();
      return true;
    } catch (error) {
      addLog(error.message, "error");
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header className="hero">
        <div className="brand-block">
          <div className="brand-icon">B</div>
          <div>
            <h1>NeoBank Mini</h1>
            <p>Secure transaction validations with React + MongoDB</p>
          </div>
        </div>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Accounts</span>
            <strong>{totalAccounts}</strong>
          </div>
          <div className="stat-card">
            <span>KYC Verified</span>
            <strong>{totalKYCVerified}</strong>
          </div>
          <div className="stat-card">
            <span>Total Balance</span>
            <strong>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              }).format(totalBalance)}
            </strong>
          </div>
        </section>
      </header>

      <nav className="nav-row">
        <NavLink to="/create-account" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Create Account
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Transactions
        </NavLink>
        <NavLink to="/accounts" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Account Listing
        </NavLink>
        <NavLink to="/output" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Messages
        </NavLink>
      </nav>

      <Routes>
        <Route
          path="/create-account"
          element={
            <AccountForm
              loading={loading}
              onSubmit={(payload) =>
                wrapAction(() => api.createAccount(payload), "Account created successfully")
              }
            />
          }
        />
        <Route
          path="/transactions"
          element={
            <TransactionPanel
              loading={loading}
              onDeposit={(payload) => wrapAction(() => api.deposit(payload), "Deposit successful")}
              onWithdraw={(payload) => wrapAction(() => api.withdraw(payload), "Withdrawal successful")}
              onTransfer={(payload) => wrapAction(() => api.transfer(payload), "Transfer successful")}
            />
          }
        />
        <Route
          path="/accounts"
          element={<AccountList accounts={accounts} onRefresh={loadAccounts} />}
        />
        <Route path="/output" element={<OutputPanel logs={logs} />} />
        <Route path="*" element={<Navigate to="/create-account" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </main>
  );
}
