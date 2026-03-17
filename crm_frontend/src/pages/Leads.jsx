import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

export default function Leads(){

  const [leads,setLeads] = useState([])
  const [search,setSearch] = useState("")

  useEffect(()=>{
    fetchLeads()
  },[])

  const fetchLeads = async () => {

    try{

      const role = localStorage.getItem("role")
      const user_id = localStorage.getItem("user_id")

      const res = await API.get("/leads",{
        params:{
          role:role,
          user_id:user_id
        }
      })

      setLeads(res.data)

    }catch(error){

      console.log("Error loading leads",error)

    }

  }


  const deleteLead = async(id)=>{

    const confirmDelete = window.confirm("Delete this lead?")

    if(!confirmDelete) return

    try{

      await API.delete(`/leads/${id}`)

      alert("Lead deleted successfully")

      fetchLeads()

    }catch(error){

      console.log("Delete failed",error)

    }

  }


  const filteredLeads = leads.filter((lead)=>
    lead.student_name?.toLowerCase().includes(search.toLowerCase()) ||
    lead.student_contact?.includes(search)
  )


  return(

<div>

<h1 className="text-2xl font-bold mb-6">
Lead Management
</h1>

<input
placeholder="Search by name or mobile"
className="border p-2 rounded mb-4 w-80"
onChange={(e)=>setSearch(e.target.value)}
/>

<div className="bg-white rounded shadow">

<table className="w-full">

<thead className="bg-gray-100">

<tr>

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

{filteredLeads.map((lead)=>(

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

<span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">

{lead.status}

</span>

</td>

<td className="p-3">

<span className="bg-red-100 text-red-600 px-2 py-1 rounded">

{lead.temperature}

</span>

</td>

<td className="p-3">
{lead.next_followup}
</td>


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
onClick={()=>deleteLead(lead.id)}
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

</div>

)

}