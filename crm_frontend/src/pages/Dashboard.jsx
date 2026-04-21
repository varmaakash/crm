import { useEffect, useState } from "react";
import API from "../api/api";
import {
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, LabelList
} from "recharts";

export default function Dashboard() {

  const [stats, setStats] = useState({});
  const [employeeMetrics, setEmployeeMetrics] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [sourceData, setSourceData] = useState([]);
  

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const emp = await API.get("/dashboard/employee-performance").catch(()=>({data:[]}));
      const follow = await API.get("/dashboard/followup-metrics").catch(()=>({data:{}}));
      const temp = await API.get("/dashboard/temperature").catch(()=>({data:[]}));
      const course = await API.get("/dashboard/course").catch(()=>({data:[]}));
      const leads = await API.get("/dashboard/leads").catch(()=>({data:[]}));
      const status = await API.get("/dashboard/status-count").catch(()=>({data:[]}));

      setEmployeeMetrics(emp.data || []);
      setTemperatureData(temp.data || []);
      setCourseData(course.data || []);
      setAllLeads(leads.data || []);
      setFilteredLeads(leads.data || []);

      const map = {};
      (status.data || []).forEach(s => map[s.status] = s.count);
      setStatusMap(map);
      const source = await API.get("/dashboard/source-count").catch(()=>({data:[]}));
setSourceData(source.data || []);

      let totalLeads = 0;
      let totalConversions = 0;

      (emp.data || []).forEach(e => {
        totalLeads += e.leads_handled || 0;
        totalConversions += e.conversions || 0;
      });

      setStats({
        total_leads: totalLeads,
        conversion_rate: totalLeads
          ? ((totalConversions / totalLeads) * 100).toFixed(2)
          : 0,
        pending: follow.data?.pending || 0,
        missed: follow.data?.missed || 0,
        today: follow.data?.today || 0,
        completed_today: follow.data?.completed_today || 0
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    const filtered = (allLeads || []).filter(l =>
      l.student_name?.toLowerCase().includes(text.toLowerCase()) ||
      l.student_contact?.includes(text) ||
      l.interested_course?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLeads(filtered);
  };

  const loadLeads = async (type) => {
    if(type === "all"){
      setFilteredLeads(allLeads);
      return;
    }

    try {
      if(["new","contacted","interested","converted","dropped"].includes(type)){
        const res = await API.get(`/dashboard/leads?status=${type}`);
        setFilteredLeads(res.data || []);
      } else {
        const res = await API.get(`/dashboard/kpi-leads?type=${type}`);
        setFilteredLeads(res.data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  const COLORS = {
    hot: "#22c55e",
    warm: "#eab308",
    cold: "#ef4444"
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">

      <h1 className="text-3xl font-bold">🚀 Smart Scholars 360 Insights</h1>

      {/* CARDS */}
      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-4">
          <Card title="Total Lead" value={stats.total_leads} color="bg-blue-600" onClick={()=>loadLeads("all")} />
          <Card title="New" value={statusMap.new || 0} color="bg-orange-500" onClick={()=>loadLeads("new")} />
          <Card title="Contacted" value={statusMap.contacted || 0} color="bg-yellow-500" onClick={()=>loadLeads("contacted")} />
          <Card title="Interested" value={statusMap.interested || 0} color="bg-green-500" onClick={()=>loadLeads("interested")} />
          <Card title="Converted" value={statusMap.converted || 0} color="bg-indigo-600" onClick={()=>loadLeads("converted")} />
          <Card title="Dropped" value={statusMap.dropped || 0} color="bg-red-600" onClick={()=>loadLeads("dropped")} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card title="Today Followups" value={stats.today} color="bg-blue-500" onClick={()=>loadLeads("today")} />
          <Card title="Missed Followups" value={stats.missed} color="bg-red-500" onClick={()=>loadLeads("missed")} />
          <Card title="Upcoming Followups" value={stats.pending} color="bg-green-600" onClick={()=>loadLeads("pending")} />
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        <Box title="🔥 Lead Temperature">
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>

      <Pie
        data={temperatureData}
        dataKey="total"
        nameKey="temperature"   // 🔥 IMPORTANT (legend fix)
        label={({ payload }) => payload?.total || 0} // 🔥 crash safe
      >

        {(temperatureData || []).map((e, i) => (
          <Cell
            key={i}
            fill={COLORS[e.temperature?.toLowerCase()] || "#8884d8"} // 🔥 safe color
          />
        ))}

      </Pie>

      {/* 🔥 TOOLTIP ADD */}
      <Tooltip
        formatter={(value, name) => [`${value} Leads`, name]}
      />

      {/* 🔥 LEGEND FIX */}
      <Legend formatter={(value) => value.toUpperCase()} />

    </PieChart>
  </ResponsiveContainer>
</Box>

        <Box title="📊 Course wise lead with Temperature">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={courseData} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="course" type="category" width={150} />
              <Tooltip />

              <Bar dataKey="hot" stackId="a" fill="#22c55e" radius={[8,8,8,8]}>
                <LabelList dataKey="hot" position="inside" fill="#fff"/>
              </Bar>

              <Bar dataKey="warm" stackId="a" fill="#eab308" radius={[8,8,8,8]}>
                <LabelList dataKey="warm" position="inside" fill="#000"/>
              </Bar>

              <Bar dataKey="cold" stackId="a" fill="#ef4444" radius={[8,8,8,8]}>
                <LabelList dataKey="cold" position="inside" fill="#fff"/>
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </Box>

      </div>

      {/* EMPLOYEE TABLE */}
      <Box title="🏆 Employee Performance">
        <table className="w-full text-sm rounded shadow overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Leads</th>
              <th className="p-3">Conv</th>
              <th className="p-3">%</th>
              <th className="p-3">💰 Incentive</th>
              <th className="p-3">🏆 Rank</th>
            </tr>
          </thead>
          <tbody>
            {(employeeMetrics || []).map((e,i)=>(
              <tr key={i} className="text-center hover:bg-gray-100">
                <td className="p-3 font-medium">{e.full_name}</td>
                <td className="p-3">{e.leads_handled}</td>
                <td className="p-3">{e.conversions}</td>
                <td className="p-3">{e.conversion_rate}%</td>
                <td className="p-3 font-bold text-green-600">₹ {e.incentive}</td>
                <td className="p-3 font-bold">{e.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {/* 💰 EMPLOYEE PERFORMANCE CHART */}
<Box title="💰 Employee Performance Chart" className="mx-auto w-3/4">

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={employeeMetrics} barCategoryGap="30%">

      <XAxis dataKey="full_name" />
      <YAxis label={{ value: "Incentive ₹", angle: -90, position: "insideLeft" }} />
      <Tooltip />

      <Bar 
        dataKey="incentive"
        barSize={30}
        radius={[10, 10, 0, 0]}   // 🔥 curved sexy bars
      >
        <LabelList dataKey="incentive" position="top" />

        {(employeeMetrics || []).map((e, i) => (
          <Cell
            key={i}
            fill={
              i === 0 ? "#22c55e" :   // 🥇 top performer
              i === 1 ? "#3b82f6" :   // 🥈 second
              "#f59e0b"               // others
            }
          />
        ))}

      </Bar>

    </BarChart>
  </ResponsiveContainer>

</Box>

<Box title="📊 Lead Source Performance">

  <ResponsiveContainer width="100%" height={400}>
    <BarChart 
      data={sourceData}
      margin={{ top: 20, right: 20, left: 20, bottom: 120 }} // 👈 extra space
    >

      {/* ✅ X AXIS FULL FIX */}
      <XAxis 
        dataKey="source"
        interval={0}
        angle={-90}              // 🔥 full vertical
        textAnchor="end"
        height={120}             // 👈 IMPORTANT (space for full text)
      />

      {/* ✅ Y AXIS LABEL */}
      <YAxis 
        label={{ value: "No. of Leads", angle: -90, position: "insideLeft" }}
      />

      <Tooltip />

      <Bar 
        dataKey="total"
        radius={[12,12,0,0]}
        barSize={35}
      >
        <LabelList dataKey="total" position="top" />

        {/* 🔥 MULTI COLOR */}
        {(sourceData || []).map((entry, index) => {

          const colors = [
            "#22c55e",
            "#3b82f6",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#06b6d4",
            "#f97316",
            "#14b8a6"
          ];

          return (
            <Cell 
              key={index}
              fill={colors[index % colors.length]}
            />
          );
        })}

      </Bar>

    </BarChart>
  </ResponsiveContainer>

</Box>
      {/* LEADS TABLE */}
      <Box title="📋 Leads Table">

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">

            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="p-3 text-left">Name</th>
                <th>Mobile</th>
                <th>Course</th>
                <th>Status</th>
                <th>Followup</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {(filteredLeads || []).map((l,i)=>(
                <tr key={i} className="bg-white shadow hover:shadow-lg text-center">
                  <td className="p-3">{l.student_name}</td>
                  <td>{l.student_contact}</td>
                  <td>{l.interested_course}</td>
                  <td>{l.status}</td>
                  <td>{l.next_followup}</td>
                  <td className="flex justify-center gap-2">
                    <a href={`tel:${l.student_contact}`} className="bg-green-500 px-2 py-1 text-white rounded">📞</a>
                    <a href={`https://wa.me/91${l.student_contact}`} target="_blank" className="bg-green-700 px-2 py-1 text-white rounded">💬</a>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div className="mt-4">
          <input
            placeholder="🔍 Search leads..."
            className="p-3 border rounded w-full"
            onChange={(e)=>handleSearch(e.target.value)}
          />
        </div>

      </Box>

    </div>
  );
}

function Card({ title, value, color, onClick }) {
  return (
    <div onClick={onClick} className={`${color} text-white p-5 rounded-xl cursor-pointer shadow-md hover:shadow-2xl hover:-translate-y-1 transition`}>
      <p>{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition">
      <h2 className="font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}