import { useState } from "react";
import API from "../api/api";

export default function FollowupPanel({ leadId, refresh, currentStatus }) {

  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState(currentStatus || "");
  const [temperature, setTemperature] = useState("");
  const [nextFollowup, setNextFollowup] = useState("");

  const addFollowup = async () => {
    const user_id = localStorage.getItem("user_id");

    try {
      await API.post("/followups/add", {
        lead_id: leadId,
        counsellor_id: user_id,
        remark: remark,
        status: status,
        temperature: temperature,
        next_followup: nextFollowup
      });

      setRemark("");
      setTemperature("");
      setNextFollowup("");

      refresh();

    } catch (error) {
      console.log("Followup error", error);
    }
  };

  return (

    <div className="bg-white/80 backdrop-blur-xl shadow-xl p-6 rounded-2xl">

      <h2 className="text-2xl font-bold mb-5 text-gray-800">
        ✍️ Add Followup
      </h2>

      {/* REMARK (🔥 TEXTAREA BIG) */}
      <textarea
        placeholder="Write detailed remark... (what happened in call, next step, etc.)"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        rows={4}
        className="border border-gray-300 p-3 w-full mb-4 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
      />

      {/* STATUS */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 p-3 w-full mb-4 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
      >
        <option value="">Select Status</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="interested">Interested</option>
        <option value="converted">Converted</option>
        <option value="dropped">Dropped</option>
      </select>

      {/* TEMPERATURE */}
      <select
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
        className="border border-gray-300 p-3 w-full mb-4 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
      >
        <option value="">Select Temperature</option>
        <option value="cold">Cold ❄️</option>
        <option value="warm">Warm 🌤️</option>
        <option value="hot">Hot 🔥</option>
      </select>

      {/* DATE */}
      <input
        type="date"
        value={nextFollowup}
        onChange={(e) => setNextFollowup(e.target.value)}
        className="border border-gray-300 p-3 w-full mb-5 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
      />

      {/* BUTTON */}
      <button
        onClick={addFollowup}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
      >
        🚀 Save Followup
      </button>

    </div>

  );
}