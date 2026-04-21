import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import FollowupPanel from "../components/FollowupPanel";

export default function LeadProfile() {

  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [assignedTo, setAssignedTo] = useState(null);
  const [users, setUsers] = useState([]);
  const [toUser, setToUser] = useState("");

  const fetchLead = async () => {
    try {
      const res = await API.get(`/leads/${id}`);
      setLead(res.data.lead);
      setFollowups(res.data.followups || []);
      setAssignedTo(res.data.assigned_to);
    } catch (error) {
      console.log("Error loading lead", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data || []);
    } catch (error) {
      console.log("Error loading users", error);
    }
  };

  useEffect(() => {
    fetchLead();
    fetchUsers();
  }, [id]);

  const transferLead = async () => {
    if (!toUser) {
      alert("Select counsellor");
      return;
    }

    try {
      await API.post(`/leads/move/${id}?to_user=${toUser}`);
      alert("Lead transferred");
      fetchLead();
    } catch (error) {
      console.log(error);
    }
  };

  if (!lead) return <div className="p-6">Loading...</div>;

  const temperatureColor = {
    hot: "bg-red-100 text-red-600",
    warm: "bg-yellow-100 text-yellow-700",
    cold: "bg-blue-100 text-blue-600"
  };

  return (

    <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-6 flex justify-between items-center border border-gray-200">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {lead.student_name}
          </h1>

          <p className="text-gray-500 mt-1">
            📞 {lead.student_contact}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Assigned To: <b>{assignedTo || "Not Assigned"}</b>
          </p>

          <div className="mt-4 flex gap-2">
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {lead.status}
            </span>

            <span className={`px-3 py-1 rounded-full text-sm font-medium ${temperatureColor[lead.temperature]}`}>
              {lead.temperature}
            </span>
          </div>
        </div>

        <a
          href={`tel:${lead.student_contact}`}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 text-white px-6 py-2 rounded-xl shadow-md transition"
        >
          📞 Call Now
        </a>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-2 space-y-6">

          {/* Academic */}
          <div className="bg-white/70 backdrop-blur-lg shadow rounded-2xl p-6 border">
            <h2 className="text-lg font-bold mb-4 text-indigo-600">
              🎓 Academic Profile
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">

              <p><b>Course:</b> {lead.interested_course || "N/A"}</p>
              <p><b>Qualification:</b> {lead.qualification || "N/A"}</p>

              <p><b>School:</b> {lead.school_name || "N/A"}</p>
              <p><b>Year:</b> {lead.year_of_passing || "N/A"}</p>

              <p><b>Location:</b> {lead.interested_location || "N/A"}</p>

            </div>
          </div>

          {/* Parent */}
          <div className="bg-white/70 backdrop-blur-lg shadow rounded-2xl p-6 border">
            <h2 className="text-lg font-bold mb-4 text-indigo-600">
              👨‍👩‍👧 Parent Info
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">

              <p><b>Name:</b> {lead.parent_name || "N/A"}</p>
              <p><b>Contact:</b> {lead.parent_contact || "N/A"}</p>

              <p><b>City:</b> {lead.city || "N/A"}</p>
              <p><b>State:</b> {lead.state || "N/A"}</p>

              <p><b>Country:</b> {lead.country || "N/A"}</p>
              <p><b>Address:</b> {lead.address || "N/A"}</p>

            </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-white/70 backdrop-blur-lg shadow rounded-2xl p-6 border">

            <h2 className="text-lg font-bold mb-4 text-indigo-600">
              📅 Followup Timeline
            </h2>

            {followups.length === 0 && (
              <p className="text-gray-500">No followups yet</p>
            )}

            {followups.map((f) => (

              <div
                key={f.id}
                className="mb-4 p-4 rounded-xl bg-gradient-to-r from-white to-indigo-50 shadow hover:shadow-xl transition border"
              >

                <div className="flex justify-between items-center">

                  <div className="flex gap-2 items-center">
                    <span className="font-semibold text-indigo-600 capitalize">
                      {f.status}
                    </span>

                    <span className={`text-xs px-2 py-1 rounded ${temperatureColor[f.temperature]}`}>
                      {f.temperature}
                    </span>
                  </div>

                  <span className="text-xs text-gray-400">
                    📅 {f.next_followup || "No date"}
                  </span>

                </div>

                <div className="mt-3 bg-white/80 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 italic">
                    📝 {f.remark || "No remark"}
                  </p>
                </div>

                <div className="flex justify-between mt-3 text-xs text-gray-500">
                  <span>👤 {f.updated_by || "System"}</span>
                  <span>{f.updated_at || ""}</span>
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* FOLLOWUP */}
          <div className="bg-white/70 backdrop-blur-lg shadow rounded-2xl p-6 border">
            <h2 className="font-bold mb-4 text-indigo-600">
              ✍️ Log Followup
            </h2>

            <FollowupPanel leadId={id} refresh={fetchLead} />
          </div>

          {/* TRANSFER */}
          <div className="bg-white/70 backdrop-blur-lg shadow rounded-2xl p-6 border">

            <h2 className="font-bold mb-4 text-indigo-600">
              🔁 Transfer Lead
            </h2>

            <select
              className="border p-2 w-full rounded-lg"
              value={toUser}
              onChange={(e) => setToUser(e.target.value)}
            >
              <option value="">Select Counsellor</option>

              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>

            <button
              onClick={transferLead}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 text-white w-full mt-3 py-2 rounded-xl transition"
            >
              Transfer
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}