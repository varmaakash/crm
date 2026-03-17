import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function CallingPanel() {

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {

    try {

      const role = localStorage.getItem("role");
      const user_id = localStorage.getItem("user_id");

      const res = await API.get("/leads", {
        params: {
          role: role,
          user_id: user_id
        }
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


  if (loading) {

    return <div className="p-6">Loading...</div>;

  }

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Calling Panel
      </h1>

      <div className="bg-white shadow rounded overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Next Followup</th>
              <th className="p-3 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {leads.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6">
                  No leads available
                </td>
              </tr>
            )}

            {leads.map((lead) => (

              <tr key={lead.id} className="border-t">

                <td className="p-3">
                  {lead.student_name}
                </td>

                <td className="p-3">
                  {lead.student_contact}
                </td>

                <td className="p-3">
                  {lead.interested_course}
                </td>

                <td className="p-3">
                  {lead.status}
                </td>

                <td className="p-3">
                  {lead.next_followup}
                </td>

                <td className="p-3 flex gap-2">

                  <a
                    href={`tel:${lead.student_contact}`}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Call
                  </a>

                  <Link
                    to={`/lead/${lead.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Profile
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}