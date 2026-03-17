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

    try{

      const res = await API.get(`/leads/${id}`);

      setLead(res.data.lead);
      setFollowups(res.data.followups || []);
      setAssignedTo(res.data.assigned_to);

    }catch(error){

      console.log("Error loading lead",error)

    }

  };

  const fetchUsers = async () => {

    try{

      const res = await API.get("/users");

      setUsers(res.data || []);

    }catch(error){

      console.log("Error loading users",error)

    }

  };

  useEffect(()=>{

    fetchLead();
    fetchUsers();

  },[id])


  const transferLead = async()=>{

    if(!toUser){
      alert("Select counsellor");
      return;
    }

    try{

      await API.post(`/leads/move/${id}?to_user=${toUser}`);

      alert("Lead transferred");

      fetchLead();

    }catch(error){

      console.log(error)

    }

  }


  if(!lead){

    return <div className="p-6">Loading...</div>

  }


  const temperatureColor = {

    hot: "bg-red-100 text-red-600",
    warm: "bg-yellow-100 text-yellow-700",
    cold: "bg-blue-100 text-blue-600"

  }

  return(

<div className="p-6 space-y-6">


{/* HEADER */}

<div className="bg-white shadow rounded-xl p-6 flex justify-between items-center">

<div>

<h1 className="text-2xl font-bold">
{lead.student_name}
</h1>

<p className="text-gray-500">
📞 {lead.student_contact}
</p>

<p className="text-sm text-gray-500 mt-1">
Assigned To: {assignedTo ? assignedTo : "Not Assigned"}
</p>

<div className="mt-3 flex gap-2">

<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
{lead.status}
</span>

<span className={`px-3 py-1 rounded text-sm ${temperatureColor[lead.temperature]}`}>
{lead.temperature}
</span>

</div>

</div>

<a
href={`tel:${lead.student_contact}`}
className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
>
Call Now
</a>

</div>



{/* GRID */}

<div className="grid grid-cols-3 gap-6">


{/* LEFT SIDE */}

<div className="col-span-2 space-y-6">


{/* Academic Profile */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-lg font-bold mb-4">
Academic Profile
</h2>

<div className="grid grid-cols-2 gap-3 text-sm">

<p><b>Course:</b> {lead.interested_course}</p>
<p><b>Qualification:</b> {lead.qualification}</p>

<p><b>School:</b> {lead.school_name}</p>
<p><b>Year:</b> {lead.year_of_passing}</p>

<p><b>Preferred Location:</b> {lead.interested_location}</p>

</div>

</div>



{/* Parent Info */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-lg font-bold mb-4">
Parent Info
</h2>

<div className="grid grid-cols-2 gap-3 text-sm">

<p><b>Parent Name:</b> {lead.parent_name}</p>
<p><b>Parent Contact:</b> {lead.parent_contact}</p>

<p><b>City:</b> {lead.city}</p>
<p><b>State:</b> {lead.state}</p>

<p><b>Country:</b> {lead.country}</p>
<p><b>Address:</b> {lead.address}</p>

</div>

</div>



{/* FOLLOWUP TIMELINE */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="text-lg font-bold mb-4">
Followup Timeline
</h2>

{followups.length === 0 && (

<p className="text-gray-500">
No followups yet
</p>

)}

{followups.map((f)=>(

<div key={f.id} className="border-b py-4">

<div className="flex justify-between">

<span className="font-semibold text-blue-600">
{f.status}
</span>

<span className={`text-xs px-2 py-1 rounded ${temperatureColor[f.temperature]}`}>
{f.temperature}
</span>

</div>

<p className="text-sm text-gray-700 mt-1">
{f.remark}
</p>

<p className="text-xs text-gray-500 mt-1">
Next Followup : {f.next_followup}
</p>

<p className="text-xs text-gray-400">
Updated by: {f.updated_by}
</p>

</div>

))}

</div>

</div>



{/* RIGHT SIDE */}

<div className="space-y-6">


{/* FOLLOWUP PANEL */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="font-bold mb-4">
Log Followup
</h2>

<FollowupPanel leadId={id} refresh={fetchLead}/>

</div>



{/* TRANSFER LEAD */}

<div className="bg-white shadow rounded-xl p-6">

<h2 className="font-bold mb-4">
Transfer Lead
</h2>

<select
className="border p-2 w-full rounded"
value={toUser}
onChange={(e)=>setToUser(e.target.value)}
>

<option value="">
Select Counsellor
</option>

{users.map((u)=>(

<option key={u.id} value={u.id}>
{u.full_name}
</option>

))}

</select>

<button
onClick={transferLead}
className="bg-blue-600 hover:bg-blue-700 text-white w-full mt-3 py-2 rounded"
>

Transfer

</button>

</div>

</div>

</div>

</div>

)

}