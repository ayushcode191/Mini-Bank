export default function OutputPanel({ logs }) {
  return (
    <div className="card output-panel">
      <h2>Output Panel</h2>
      <div className="output-scroll">
        {logs.length === 0 ? (
          <p className="muted">No output yet...</p>
        ) : (
          logs.map((item) => (
            <div key={item.id} className={`log-item ${item.type}`}>
              <p>{item.message}</p>
              <small>{item.time}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}