import { useState, useEffect } from "react";
import API from "../api/api";

export default function CreateUser() {

  const [showModal, setShowModal] = useState(false);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("counsellor");

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/dashboard/all-employees");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 CREATE USER
  const createUser = async () => {
    try {
      await API.post("/auth/register", {
        full_name: fullName,
        mobile,
        password,
        role
      });

      alert("User Created ✅");

      setShowModal(false);
      setFullName("");
      setMobile("");
      setPassword("");

      fetchEmployees();

    } catch (err) {
      alert("Failed ❌");
    }
  };

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👨‍💼 Employees</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + Add Employee
        </button>
      </div>

      {/* EMPLOYEE CARDS */}
      <div className="grid grid-cols-3 gap-6">

        {employees.map((emp) => {

          const initial = emp.full_name?.charAt(0).toUpperCase();
          const conversionRate = emp.total_leads
            ? Math.round((emp.converted / emp.total_leads) * 100)
            : 0;

          return (
            <div
              key={emp.id}
              className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition"
            >

              {/* TOP */}
              <div className="flex items-center gap-4 mb-4">

                <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-lg">
                  {initial}
                </div>

                <div>
                  <h3 className="font-semibold">{emp.full_name}</h3>
                  <p className="text-gray-500 text-sm">{emp.mobile}</p>
                </div>

              </div>

              {/* ROLE */}
              <span className={`px-3 py-1 text-xs rounded-full ${
                emp.role === "admin"
                  ? "bg-purple-100 text-purple-600"
                  : "bg-blue-100 text-blue-600"
              }`}>
                {emp.role}
              </span>

              <hr className="my-4" />

              {/* STATS */}
              <div className="flex justify-between text-sm mb-3">

                <div>
                  <p className="text-gray-500">Leads</p>
                  <p className="font-bold">{emp.total_leads}</p>
                </div>

                <div>
                  <p className="text-gray-500">Converted</p>
                  <p className="font-bold text-green-600">
                    {emp.converted}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Rate</p>
                  <p className="font-bold text-indigo-600">
                    {conversionRate}%
                  </p>
                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-3">

                <button className="flex-1 bg-indigo-100 text-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-200">
                  🔑 Reset
                </button>

                <button className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm hover:bg-yellow-200">
                  ✏️ Edit
                </button>

                <button className="flex-1 bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200">
                  🗑 Delete
                </button>

              </div>

            </div>
          );
        })}

      </div>

      {/* MODAL */}
      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-xl w-96 animate-scale">

            <h2 className="text-xl font-bold mb-4">
              Create User
            </h2>

            <input
              placeholder="Full Name"
              className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              value={fullName}
              onChange={(e)=>setFullName(e.target.value)}
            />

            <input
              placeholder="Mobile"
              className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              value={mobile}
              onChange={(e)=>setMobile(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <select
              className="w-full mb-4 p-2 border rounded"
              value={role}
              onChange={(e)=>setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="counsellor">Counsellor</option>
            </select>

            <div className="flex gap-3">

              <button
                onClick={()=>setShowModal(false)}
                className="w-full bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={createUser}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}