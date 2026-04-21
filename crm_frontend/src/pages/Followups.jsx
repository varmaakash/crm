import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Followups() {

  const [followups, setFollowups] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchFollowups = async () => {
    try {
      const res = await API.get("/dashboard/followups", {
        params: { type: filter }
      });
      setFollowups(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, [filter]);

  const markDone = async (id) => {
    await API.put(`/followups/${id}/complete`);
    fetchFollowups();
  };

  const deleteFollowup = async (id) => {
    await API.delete(`/followups/${id}`);
    fetchFollowups();
  };

  const getStatus = (f) => {
    if (f.completed_at) return "DONE";
    if (new Date(f.next_followup) < new Date()) return "MISSED";
    return "UPCOMING";
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">📅 Follow-ups</h1>
        <p className="text-gray-500">
          Smart follow-up tracking 🚀
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-6">
        {["all", "today", "missed", "upcoming"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition 
              ${filter === f
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CARDS */}
      <div className="flex flex-col gap-4">

        {followups.map((f) => {

          const status = getStatus(f);

          return (

            <Link key={f.id} to={`/lead/${f.lead_id}`}>

              <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-xl hover:scale-[1.01] transition cursor-pointer">

                {/* TOP */}
                <div className="flex justify-between items-center">

                  <div>
                    <h2 className="text-lg font-semibold">
                      {f.student_name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      📚 {f.interested_course || "Not specified"}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">

                    {/* CALL */}
                    {f.student_contact && (
                      <a
                        href={`tel:${f.student_contact}`}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        📞
                      </a>
                    )}

                    {/* DONE */}
                    {!f.completed_at && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markDone(f.id);
                        }}
                        className="bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1 rounded-lg"
                      >
                        ✔
                      </button>
                    )}

                    {/* DELETE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFollowup(f.id);
                      }}
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg"
                    >
                      🗑
                    </button>

                  </div>
                </div>

                {/* DATE */}
                <p className="text-sm text-gray-500 mt-2">
                  📅 {f.next_followup}
                </p>

                {/* REMARK */}
                <p className="text-gray-800 mt-2 italic">
                  📝 {f.remark || "No remark"}
                </p>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-3">

                  <p className="text-xs text-gray-500">
                    👤 {f.updated_by || "Unknown"} • {f.updated_at || ""}
                  </p>

                  <span className={`px-3 py-1 text-xs rounded-full font-semibold
                    ${status === "DONE"
                      ? "bg-green-100 text-green-600"
                      : status === "MISSED"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {status}
                  </span>

                </div>

              </div>

            </Link>
          );
        })}

      </div>

    </div>
  );
}