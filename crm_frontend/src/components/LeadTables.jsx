import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function LeadTables() {

  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {

    try {

      const res = await API.get("/leads");

      setLeads(res.data);

    } catch (error) {

      console.log("Error loading leads", error);

    }

  };

  useEffect(() => {

    fetchLeads();

  }, []);


  const deleteLead = async (id) => {

    const confirmDelete = window.confirm("Delete this lead?");

    if (!confirmDelete) return;

    try {

      await API.delete(`/leads/${id}`);

      alert("Lead deleted successfully");

      fetchLeads();

    } catch (error) {

      console.error("Delete failed:", error);

      alert("Failed to delete lead");

    }

  };


  return (

    <div className="bg-white shadow rounded">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Mobile</th>
            <th className="p-3 text-left">Course</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Temperature</th>
            <th className="p-3 text-left">Next Followup</th>
            <th className="p-3 text-left">Actions</th>

          </tr>

        </thead>

        <tbody>

          {leads.map((lead) => (

            <tr key={lead.id} className="border-b">

              <td className="p-3">{lead.student_name}</td>

              <td className="p-3">{lead.student_contact}</td>

              <td className="p-3">{lead.interested_course}</td>

              <td className="p-3">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {lead.status}
                </span>
              </td>

              <td className="p-3">
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                  {lead.temperature}
                </span>
              </td>

              <td className="p-3">{lead.next_followup}</td>


              <td className="p-3 flex gap-2">

                <a
                  href={`tel:${lead.student_contact}`}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Call
                </a>

                <Link
                  to={`/lead/${lead.id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Profile
                </Link>

                <Link
                  to={`/edit-lead/${lead.id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteLead(lead.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}