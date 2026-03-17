import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadProfile from "./pages/LeadProfile";
import AddLead from "./pages/AddLead";
import CallingPanel from "./pages/CallingPanel";
import EditLead from "./pages/EditLead";
import Login from "./pages/Login";
import Register from "./pages/Register"
import CreateUser from "./pages/CreateUser"

function App() {

  const [token, setToken] = useState(null);

  useEffect(() => {

    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
    }

  }, []);


  // अगर login नहीं है
  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }


  // अगर login है
  return (

    <BrowserRouter>

      <div className="flex">

        <Sidebar />

        <div className="p-8 w-full bg-gray-100 min-h-screen">

          <Routes>

            <Route path="/" element={<Dashboard />} />

            <Route path="/calling" element={<CallingPanel />} />

            <Route path="/leads" element={<Leads />} />

            <Route path="/lead/:id" element={<LeadProfile />} />

            <Route path="/add-lead" element={<AddLead />} />

            <Route path="/edit-lead/:id" element={<EditLead />} />

            <Route path="/register" element={<Register />} />

            <Route path="/create-user" element={<CreateUser />} />

          </Routes>

        </div>

      </div>

    </BrowserRouter>

  );

}

export default App;