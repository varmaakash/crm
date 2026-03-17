import { useEffect, useState } from "react";
import API from "../api/api";

export default function Dashboard() {

  const [stats, setStats] = useState({
    total_leads: 0,
    new_leads: 0,
    converted: 0,
    dropped: 0,
    today_followups: 0
  });

  const [leads, setLeads] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStats();
    fetchLeads();
  }, []);

  const role = localStorage.getItem("role");
  const user_id = localStorage.getItem("user_id");


  const fetchStats = async () => {

    try {

      const res = await API.get("/dashboard/stats", {
        params: {
          role: role,
          user_id: user_id
        }
      });

      setStats(res.data);

    } catch (error) {

      console.error("Dashboard API error", error);

    }

  };


  const fetchLeads = async (params = {}) => {

    try {

      const res = await API.get("/leads", {
        params: {
          role: role,
          user_id: user_id,
          ...params
        }
      });

      setLeads(res.data);
      setTitle("All Leads");

    } catch (error) {

      console.log("Error loading leads", error);

    }

  };


  const loadLeads = async (type) => {

    let params = {};

    if (type === "New Leads") params.status = "new";
    if (type === "Converted") params.status = "converted";
    if (type === "Dropped") params.status = "dropped";

    if (type === "Hot Leads") params.temperature = "hot";
    if (type === "Warm Leads") params.temperature = "warm";
    if (type === "Cold Leads") params.temperature = "cold";

    if (type === "Today Followups") {
      params.today_followups = true;
    }

    try {

      const res = await API.get("/leads", {
        params: {
          role: role,
          user_id: user_id,
          ...params
        }
      });

      setLeads(res.data);
      setTitle(type);

    } catch (error) {

      console.log("Filter error", error);

    }

  };


  const filteredLeads = leads.filter((lead) =>
    lead.student_name?.toLowerCase().includes(search.toLowerCase()) ||
    lead.student_contact?.includes(search) ||
    lead.interested_course?.toLowerCase().includes(search.toLowerCase())
  );


  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>


      {/* DASHBOARD CARDS */}

      <div className="grid grid-cols-5 gap-4 mb-6">

        <div
          className="bg-white shadow p-4 rounded text-center cursor-pointer"
          onClick={() => fetchLeads()}
        >
          <p className="text-gray-500">Total Leads</p>
          <h2 className="text-2xl font-bold">{stats.total_leads}</h2>
        </div>

        <div
          className="bg-white shadow p-4 rounded text-center cursor-pointer"
          onClick={() => loadLeads("New Leads")}
        >
          <p className="text-gray-500">New Leads</p>
          <h2 className="text-2xl font-bold">{stats.new_leads}</h2>
        </div>

        <div
          className="bg-white shadow p-4 rounded text-center cursor-pointer"
          onClick={() => loadLeads("Converted")}
        >
          <p className="text-gray-500">Converted</p>
          <h2 className="text-2xl font-bold text-green-600">
            {stats.converted}
          </h2>
        </div>

        <div
          className="bg-white shadow p-4 rounded text-center cursor-pointer"
          onClick={() => loadLeads("Dropped")}
        >
          <p className="text-gray-500">Dropped</p>
          <h2 className="text-2xl font-bold text-red-600">
            {stats.dropped}
          </h2>
        </div>

        <div
          className="bg-white shadow p-4 rounded text-center cursor-pointer"
          onClick={() => loadLeads("Today Followups")}
        >
          <p className="text-gray-500">Today Followups</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {stats.today_followups}
          </h2>
        </div>

      </div>


      {/* TEMPERATURE CARDS */}

      <div className="grid grid-cols-3 gap-4 mb-6">

        <div
          className="bg-red-100 p-4 rounded cursor-pointer text-center"
          onClick={() => loadLeads("Hot Leads")}
        >
          🔥 Hot Leads
        </div>

        <div
          className="bg-yellow-100 p-4 rounded cursor-pointer text-center"
          onClick={() => loadLeads("Warm Leads")}
        >
          🟡 Warm Leads
        </div>

        <div
          className="bg-blue-100 p-4 rounded cursor-pointer text-center"
          onClick={() => loadLeads("Cold Leads")}
        >
          🔵 Cold Leads
        </div>

      </div>


      {/* SEARCH */}

      <input
        placeholder="Search name / mobile / course"
        className="border p-2 rounded mb-4 w-80"
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* LEADS TABLE */}

      {filteredLeads.length > 0 && (

        <div className="bg-white shadow rounded p-6">

          <h2 className="text-xl font-bold mb-4">
            {title}
          </h2>

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Temperature</th>
                <th className="p-3 text-left">Next Followup</th>

              </tr>

            </thead>

            <tbody>

              {filteredLeads.map((lead) => (

                <tr key={lead.id} className="border-t">

                  <td className="p-3">{lead.student_name}</td>

                  <td className="p-3">{lead.student_contact}</td>

                  <td className="p-3">{lead.interested_course}</td>

                  <td className="p-3">{lead.status}</td>

                  <td className="p-3">{lead.temperature}</td>

                  <td className="p-3">{lead.next_followup}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}