import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function EditLead(){

const {id} = useParams()
const navigate = useNavigate()

const [users,setUsers] = useState([])
const [lead,setLead] = useState({})

useEffect(()=>{

loadLead()
fetchUsers()

},[id])

const loadLead = async()=>{

const res = await API.get(`/leads/${id}`)

setLead(res.data.lead)

}

const fetchUsers = async()=>{

const res = await API.get("/users")

setUsers(res.data)

}

const handleChange = (e)=>{

setLead({
...lead,
[e.target.name]:e.target.value
})

}

const updateLead = async(e)=>{

e.preventDefault()

await API.put(`/leads/update/${id}`,lead)

alert("Lead Updated Successfully")

navigate("/leads")

}

return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">
Edit Lead
</h1>

<form
onSubmit={updateLead}
className="bg-white p-6 rounded shadow grid grid-cols-4 gap-4"
>

<input
name="student_name"
value={lead.student_name || ""}
onChange={handleChange}
placeholder="Student Name"
className="border p-2"
/>

<input
name="student_contact"
value={lead.student_contact || ""}
onChange={handleChange}
placeholder="Mobile"
className="border p-2"
/>

<input
name="parent_name"
value={lead.parent_name || ""}
onChange={handleChange}
placeholder="Parent Name"
className="border p-2"
/>

<input
name="parent_contact"
value={lead.parent_contact || ""}
onChange={handleChange}
placeholder="Parent Mobile"
className="border p-2"
/>


<select
name="gender"
value={lead.gender || ""}
onChange={handleChange}
className="border p-2"
>

<option>Male</option>
<option>Female</option>

</select>

<input
name="qualification"
value={lead.qualification || ""}
onChange={handleChange}
placeholder="Qualification"
className="border p-2"
/>

<input
name="school_name"
value={lead.school_name || ""}
onChange={handleChange}
placeholder="School"
className="border p-2"
/>


{/* Year Dropdown */}

<select
name="year_of_passing"
value={lead.year_of_passing || ""}
onChange={handleChange}
className="border p-2"
>

<option value="">Year of Passing</option>

{Array.from({length:80},(_,i)=>{

const year = 2026 - i

return(
<option key={year} value={year}>
{year}
</option>
)

})}

</select>


<input
name="city"
value={lead.city || ""}
onChange={handleChange}
placeholder="City"
className="border p-2"
/>

<input
name="state"
value={lead.state || ""}
onChange={handleChange}
placeholder="State"
className="border p-2"
/>

<input
name="country"
value={lead.country || ""}
onChange={handleChange}
placeholder="Country"
className="border p-2"
/>


{/* Course Dropdown */}

<select
name="interested_course"
value={lead.interested_course || ""}
onChange={handleChange}
className="border p-2"
>

<option value="">Select Course</option>

<option>GNM (General Nursing & Midwifery)</option>
<option>B.Sc Nursing</option>
<option>Post Basic B.Sc Nursing (P.B.B.Sc Nursing)</option>
<option>M.Sc Nursing</option>
<option>BPT – Bachelor of Physiotherapy</option>
<option>B.Sc MLT</option>
<option>B.Sc MIT</option>
<option>B.Sc OT & Operation Theatre Technology</option>
<option>Diploma in Hotel Management</option>
<option>BBA in Hotel Management</option>
<option>Others</option>

</select>


{/* Lead Source Dropdown */}

<select
name="lead_source"
value={lead.lead_source || ""}
onChange={handleChange}
className="border p-2"
>

<option value="">Lead Source</option>

<option>Just Dial</option>
<option>Whatsapp Broadcast</option>
<option>Meta Ads</option>
<option>Cold calling</option>
<option>Got a call</option>
<option>Admission Partner reference</option>
<option>Student Refer</option>
<option>Others</option>
<option>Bulkupload</option>

</select>


{/* Counsellor Dropdown */}

<select
name="assigned_counsellor"
value={lead.assigned_counsellor || ""}
onChange={handleChange}
className="border p-2"
>

<option value="">Select Counsellor</option>

{users.map((user)=>(
<option key={user.id} value={user.id}>

{user.full_name} (ID: {user.id})

</option>
))}

</select>


<input
type="date"
name="next_followup"
value={lead.next_followup || ""}
onChange={handleChange}
className="border p-2"
/>


<div className="col-span-4">

<button
className="bg-blue-600 text-white px-6 py-2 rounded"
>

Update Lead

</button>

</div>

</form>

</div>

)

}