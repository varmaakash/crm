import { useState } from "react";
import API from "../api/api";

export default function BulkUpload() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {

    if (!file) {
      alert("Select file first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/dashboard/upload-leads", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert(res.data.message || "Upload successful 🚀");
      setFile(null);

    } catch (err) {

      console.log("ERROR:", err.response?.data || err.message);

      alert(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Upload failed ❌"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="p-8 min-h-screen bg-gray-100">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🚀 Bulk Upload Leads
      </h1>

      {/* CARD */}
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-xl mx-auto">

        {/* UPLOAD BOX */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-indigo-500 transition">

          <span className="text-gray-500 mb-2">
            📂 Click to upload Excel / CSV
          </span>

          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          {file && (
            <span className="text-sm text-indigo-600 font-medium mt-2">
              {file.name}
            </span>
          )}

        </label>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">

          {/* Upload */}
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
            }`}
          >
            {loading ? "Uploading..." : "Upload Leads"}
          </button>

          {/* Template */}
          <a
            href="http://127.0.0.1:8000/dashboard/download-template"
            className="flex-1 text-center py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition"
          >
            Download Template
          </a>

        </div>

        {/* INFO */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          Supported format: <b>.xlsx / .csv</b> <br />
          Columns: <b>name, mobile</b>
        </div>

      </div>

    </div>
  );
}