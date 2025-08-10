import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import LinkedInCallback from "./LinkedInCallback";

// Component Dashboard tạm thời (thay bằng component thực tế của bạn)
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Chào mừng: {user.username || "Người dùng"}</p>
      <p>Email: {user.email || "Không có"}</p>
      {user.avatar && <img src={user.avatar} alt="Avatar" width={100} />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
