import { useState } from "react";
import API from "../api/api";

export default function FollowupPanel({ leadId, refresh, currentStatus }) {

  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState(currentStatus || "");
  const [temperature, setTemperature] = useState("");
  const [nextFollowup, setNextFollowup] = useState("");

  const addFollowup = async () => {
    const user_id = localStorage.getItem("user_id")

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

    <div className="bg-white shadow p-6 rounded mt-6">

      <h2 className="text-xl font-bold mb-4">
        Add Followup
      </h2>

      <input
        type="text"
        placeholder="Remark"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      {/* STATUS (Pipeline Stage) */}

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 w-full mb-3"
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
        className="border p-2 w-full mb-3"
      >

        <option value="">Select Temperature</option>

        <option value="cold">Cold</option>
        <option value="warm">Warm</option>
        <option value="hot">Hot</option>

      </select>


      <input
        type="date"
        value={nextFollowup}
        onChange={(e) => setNextFollowup(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={addFollowup}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Followup
      </button>

    </div>

  );
}