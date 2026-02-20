import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckIn from "./pages/CheckIn";
import Status from "./pages/Status";
import CheckOut from "./pages/CheckOut";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckIn />} />
        <Route path="/status/:id" element={<Status />} />
        <Route path="/checkout/:id" element={<CheckOut />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
