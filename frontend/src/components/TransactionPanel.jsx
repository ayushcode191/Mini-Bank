import { useState } from "react";

const initialForm = {
  deposit: { accountNo: "", amount: "" },
  withdraw: { accountNo: "", amount: "" },
  transfer: { senderAccount: "", receiverAccount: "", amount: "" },
};

export default function TransactionPanel({ onDeposit, onWithdraw, onTransfer, loading }) {
  const [form, setForm] = useState(initialForm);

  const setField = (group, field, value) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }));
  };

  const clearGroup = (group) => {
    setForm((prev) => ({
      ...prev,
      [group]: initialForm[group],
    }));
  };

  return (
    <div className="card transaction-layout">
      <h2>Transactions</h2>

      <div className="transaction-grid">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await onDeposit({
              accountNo: form.deposit.accountNo,
              amount: Number(form.deposit.amount),
            });
            if (ok) clearGroup("deposit");
          }}
        >
          <h3>Deposit</h3>
          <input
            placeholder="Account No"
            value={form.deposit.accountNo}
            onChange={(e) => setField("deposit", "accountNo", e.target.value)}
            required
          />
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={form.deposit.amount}
            onChange={(e) => setField("deposit", "amount", e.target.value)}
            required
          />
          <button disabled={loading} type="submit">Deposit</button>
        </form>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await onWithdraw({
              accountNo: form.withdraw.accountNo,
              amount: Number(form.withdraw.amount),
            });
            if (ok) clearGroup("withdraw");
          }}
        >
          <h3>Withdraw</h3>
          <input
            placeholder="Account No"
            value={form.withdraw.accountNo}
            onChange={(e) => setField("withdraw", "accountNo", e.target.value)}
            required
          />
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={form.withdraw.amount}
            onChange={(e) => setField("withdraw", "amount", e.target.value)}
            required
          />
          <button disabled={loading} type="submit">Withdraw</button>
        </form>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await onTransfer({
              senderAccount: form.transfer.senderAccount,
              receiverAccount: form.transfer.receiverAccount,
              amount: Number(form.transfer.amount),
            });
            if (ok) clearGroup("transfer");
          }}
        >
          <h3>Transfer</h3>
          <input
            placeholder="Sender Account"
            value={form.transfer.senderAccount}
            onChange={(e) => setField("transfer", "senderAccount", e.target.value)}
            required
          />
          <input
            placeholder="Receiver Account"
            value={form.transfer.receiverAccount}
            onChange={(e) => setField("transfer", "receiverAccount", e.target.value)}
            required
          />
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={form.transfer.amount}
            onChange={(e) => setField("transfer", "amount", e.target.value)}
            required
          />
          <button disabled={loading} type="submit">Transfer</button>
        </form>
      </div>
    </div>
  );
}
