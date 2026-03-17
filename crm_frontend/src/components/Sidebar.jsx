import { Link } from "react-router-dom";

export default function Sidebar() {

  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (

    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col justify-between p-6">

      {/* TOP MENU */}

      <div>

        <h2 className="text-2xl font-bold mb-10">
          Counsellor Portal
        </h2>

        <div className="flex flex-col gap-4">

          <Link
            to="/"
            className="p-2 rounded hover:bg-slate-700"
          >
            Dashboard
          </Link>

          <Link
            to="/leads"
            className="p-2 rounded hover:bg-slate-700"
          >
            Lead Management
          </Link>

          <Link
            to="/add-lead"
            className="p-2 rounded hover:bg-slate-700"
          >
            Add Lead
          </Link>

          <Link
            to="/calling"
            className="p-2 rounded hover:bg-slate-700"
          >
            Calling Panel
          </Link>

          {/* Admin Only Menu */}

          {role === "admin" && (

            <Link
              to="/create-user"
              className="p-2 rounded hover:bg-slate-700"
            >
              Create User
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
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded"
        >
          Logout
        </button>

      </div>

    </div>

  );
}