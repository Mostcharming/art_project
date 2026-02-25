import "./App.css";

function App() {
  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1>Welcome to Carsl Admin</h1>
      <p>This is a sample admin dashboard for Carsl.</p>
      <section style={{ marginTop: "2rem" }}>
        <h2>Quick Stats</h2>
        <ul>
          <li>Users: 1,234</li>
          <li>Active Sessions: 87</li>
          <li>Pending Approvals: 12</li>
        </ul>
      </section>
      <section style={{ marginTop: "2rem" }}>
        <h2>Recent Activity</h2>
        <table
          style={{
            width: "100%",
            background: "#222",
            color: "#fff",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jane Doe</td>
              <td>Created new listing</td>
              <td>2026-02-25</td>
            </tr>
            <tr>
              <td>John Smith</td>
              <td>Approved payment</td>
              <td>2026-02-24</td>
            </tr>
            <tr>
              <td>Alex Lee</td>
              <td>Updated profile</td>
              <td>2026-02-23</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
