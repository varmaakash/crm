import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function CallingPanel() {

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  const fetchLeads = async () => {
    try {
      const role = localStorage.getItem("role");
      const user_id = localStorage.getItem("user_id");

      const res = await API.get("/leads", {
        params: { role, user_id }
      });

      setLeads(res.data);

    } catch (error) {
      console.log("Error loading leads", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const toggleRow = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const getStatusStyle = (status) => {
    if (status === "new") return "bg-blue-100 text-blue-600";
    if (status === "interested") return "bg-yellow-100 text-yellow-600";
    if (status === "converted") return "bg-green-100 text-green-600";
    if (status === "contacted") return "bg-purple-100 text-purple-600";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return <div className="ml-64 p-6">Loading...</div>;
  }

  return (

    <div className="ml-64 p-6 min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-white">

      <div className="w-full max-w-none">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold mb-8 text-gray-800">
          📞 Calling Panel
        </h1>

        {/* TABLE */}
        <div className="w-full bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden">

          {/* TABLE HEADER */}
          <div className="grid grid-cols-6 bg-gray-100/80 backdrop-blur p-4 text-gray-600 font-semibold text-sm">
            <div>Name</div>
            <div>Mobile</div>
            <div>Course</div>
            <div>Status</div>
            <div>Next Followup</div>
            <div>Actions</div>
          </div>

          {/* DATA */}
          {leads.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No leads available
            </div>
          )}

          {leads.map((lead) => (

            <div key={lead.id}>

              {/* ROW */}
              <div
                onClick={() => toggleRow(lead.id)}
                className="grid grid-cols-6 p-4 border-t items-center hover:bg-indigo-50 cursor-pointer transition duration-200"
              >

                <div className="font-semibold text-gray-800">
                  {lead.student_name}
                </div>

                <div>{lead.student_contact}</div>

                <div>{lead.interested_course || "N/A"}</div>

                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>

                <div>{lead.next_followup || "-"}</div>

                <div
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={`tel:${lead.student_contact}`}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Call
                  </a>

                  <Link
                    to={`/lead/${lead.id}`}
                    className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 transition"
                  >
                    Profile
                  </Link>
                </div>

              </div>

              {/* 🔥 EXPANDED FULL CARD */}
              {openId === lead.id && (

                <div className="bg-gradient-to-r from-white to-indigo-50 px-8 py-6 border-t">

                  <div className="grid md:grid-cols-2 gap-10">

                    {/* LEFT */}
                    <div className="space-y-3">

                      <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                        👤 Lead Details
                      </h3>

                      <p><b>Name:</b> {lead.student_name}</p>
                      <p><b>Phone:</b> {lead.student_contact}</p>
                      <p><b>Course:</b> {lead.interested_course || "N/A"}</p>
                      <p><b>City:</b> {lead.city || "N/A"}</p>
                      <p><b>Source:</b> {lead.lead_source || "N/A"}</p>

                    </div>

                    {/* RIGHT */}
                    <div className="space-y-3">

                      <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                        📊 CRM Info
                      </h3>

                      <p><b>Status:</b> {lead.status}</p>
                      <p><b>Assigned To:</b> {lead.assigned_name || "N/A"}</p>
                      <p><b>Created:</b> {lead.created_at || "N/A"}</p>
                      <p><b>Updated:</b> {lead.updated_at || "N/A"}</p>
                      <p><b>Next Followup:</b> {lead.next_followup || "N/A"}</p>

                    </div>

                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-6 flex gap-4">

                    <a
                      href={`tel:${lead.student_contact}`}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow"
                    >
                      📞 Call Now
                    </a>

                    <Link
                      to={`/lead/${lead.id}`}
                      className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition shadow"
                    >
                      🔍 View Full Profile
                    </Link>

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}