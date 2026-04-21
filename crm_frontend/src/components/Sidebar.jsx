import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const location = useLocation(); // 🔥 current route detect

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  // 🔥 active class logic
  const navClass = (path) =>
    `p-2 rounded transition ${
      location.pathname === path
        ? "bg-indigo-600 text-white font-semibold shadow"
        : "hover:bg-slate-700"
    }`;

  return (

    <div className="fixed top-0 left-0 w-64 h-screen bg-slate-900 text-white flex flex-col justify-between p-6 shadow-lg z-50">

      {/* TOP MENU */}
      <div>

        <h2 className="text-2xl font-bold mb-10">
          Counsellor Portal
        </h2>

        <div className="flex flex-col gap-3">

          <Link to="/" className={navClass("/")}>
            📊 Dashboard
          </Link>

          <Link to="/leads" className={navClass("/leads")}>
            📋 Lead Management
          </Link>

          <Link to="/add-lead" className={navClass("/add-lead")}>
            ➕ Add Lead
          </Link>

          <Link to="/calling" className={navClass("/calling")}>
            📞 Calling Panel
          </Link>
          <Link to="/followups" className="p-2 rounded hover:bg-slate-700 transition">
          📅 Follow-ups
          </Link>

          {/* 🔥 BULK UPLOAD (ADMIN ONLY) */}
          {role === "admin" && (
            <Link to="/bulk-upload" className={navClass("/bulk-upload")}>
              ⬆️ Bulk Upload
            </Link>
          )}

          {/* Admin Only */}
          {role === "admin" && (
            <Link to="/create-user" className={navClass("/create-user")}>
              👤 Employee
            </Link>
          )}

        </div>

      </div>

      {/* USER SECTION */}
      <div className="border-t border-slate-700 pt-4">

        <div className="mb-4">

          <p className="text-sm text-gray-400">
            Logged in as
          </p>

          <p className="font-semibold">
            {user}
          </p>

        </div>

        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded transition"
        >
          Logout
        </button>

      </div>

    </div>

  );
}