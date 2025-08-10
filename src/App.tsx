/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, onAuthStateChanged } from "./firebase";
import Login from "./Login";
import LinkedInCallback from "./LinkedInCallback";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || JSON.parse(localStorage.getItem("user") || "{}"));
    });
    return () => unsubscribe();
  }, []);

  const safeUsername = user?.displayName || user?.username || "User";
  const safeEmail = user?.email || "Not available";
  const safeAvatar = user?.photoURL || user?.avatar || "";

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome: {safeUsername}</p>
      <p>Email: {safeEmail}</p>
      {safeAvatar && <img src={safeAvatar} alt="Avatar" width={100} />}
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
