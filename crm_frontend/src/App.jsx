import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadProfile from "./pages/LeadProfile";
import AddLead from "./pages/AddLead";
import CallingPanel from "./pages/CallingPanel";
import EditLead from "./pages/EditLead";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateUser from "./pages/CreateUser";
import BulkUpload from "./pages/BulkUpload";
import Followups from "./pages/Followups";

function App() {

  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedTheme = localStorage.getItem("theme") || "light";

    if (savedToken) {
      setToken(savedToken);
    }

    setTheme(savedTheme);
  }, []);

  // 🔥 THEME TOGGLE FUNCTION
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  // ❌ Not logged in
  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // 🎨 GLOBAL BACKGROUND (MAIN MAGIC)
  const bgClass =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white"
      : "bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 text-gray-800";

  return (
    <BrowserRouter>

      {/* Sidebar */}
      <Sidebar />

      {/* 🔥 MAIN CONTENT */}
      <div className={`ml-64 p-6 min-h-screen transition-all duration-500 ${bgClass}`}>

        {/* 🔥 TOP BAR */}
        <div className="flex justify-end mb-4">

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-black/20 backdrop-blur text-sm hover:scale-105 transition"
          >
            {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>

        </div>

        <Routes>

          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Leads */}
          <Route path="/leads" element={<Leads />} />
          <Route path="/lead/:id" element={<LeadProfile />} />
          <Route path="/add-lead" element={<AddLead />} />
          <Route path="/edit-lead/:id" element={<EditLead />} />

          {/* Calling */}
          <Route path="/calling" element={<CallingPanel />} />

          {/* Admin */}
          <Route path="/create-user" element={<CreateUser />} />

          {/* Followups */}
          <Route path="/followups" element={<Followups />} />

          {/* Bulk Upload */}
          <Route path="/bulk-upload" element={<BulkUpload />} />

          {/* Register */}
          <Route path="/register" element={<Register />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </div>

    </BrowserRouter>
  );
}

export default App;