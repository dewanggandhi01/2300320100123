import AllNotifications from "./pages/AllNotifications";
import PriorityNotifications from "./pages/PriorityNotifications";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Notification Dashboard</h1>

      <AllNotifications />

      <hr />

      <PriorityNotifications />
    </div>
  );
}

export default App;