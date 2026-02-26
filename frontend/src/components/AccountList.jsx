export default function AccountList({ accounts, onRefresh }) {
  return (
    <div className="card">
      <div className="title-row">
        <h2>Account Listing</h2>
        <button onClick={onRefresh}>Refresh</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Account No</th>
              <th>Holder Name</th>
              <th>Balance</th>
              <th>KYC</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="4">No accounts found</td>
              </tr>
            ) : (
              accounts.map((acc) => (
                <tr key={acc._id}>
                  <td>{acc.accountNo}</td>
                  <td>{acc.holderName}</td>
                  <td>{Number(acc.balance).toFixed(2)}</td>
                  <td>{acc.isKYCVerified ? "Verified" : "Not Verified"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}