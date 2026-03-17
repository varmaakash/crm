import { useState, useEffect } from "react";
import API from "../api/api";

export default function AddLead(){

const [users,setUsers] = useState([])

const [lead,setLead] = useState({

student_name:"",
student_contact:"",
gender:"Male",
qualification:"",
school_name:"",
year_of_passing:"",
address:"",
parent_name:"",
parent_contact:"",
interested_course:"",
interested_location:"",
lead_source:"",
assigned_counsellor:1,
status:"new",
temperature:"cold",
next_followup:""

})

useEffect(()=>{
fetchUsers()
},[])

const fetchUsers = async()=>{

try{

const res = await API.get("/users")

setUsers(res.data)

}catch(error){

console.log("Error loading users",error)

}

}

const handleChange = (e)=>{
setLead({...lead,[e.target.name]:e.target.value})
}

const saveLead = async ()=>{

try{

await API.post("/leads/create",lead)

alert("Lead Added Successfully")

}catch(error){

console.log(error)

}

}

return(

<div>

<h1 className="text-2xl font-bold mb-6">
Add Lead
</h1>

<div className="bg-white p-6 rounded shadow">

<div className="grid grid-cols-4 gap-4">

<input
className="border p-2 rounded"
name="student_name"
placeholder="Student Name"
value={lead.student_name}
onChange={handleChange}
/>

<input
className="border p-2 rounded"
name="student_contact"
placeholder="Mobile"
value={lead.student_contact}
onChange={handleChange}
/>

<input
className="border p-2 rounded"
name="parent_name"
placeholder="Parent Name"
value={lead.parent_name}
onChange={handleChange}
/>

<input
className="border p-2 rounded"
name="parent_contact"
placeholder="Parent Mobile"
value={lead.parent_contact}
onChange={handleChange}
/>

<select
className="border p-2 rounded"
name="gender"
value={lead.gender}
onChange={handleChange}
>

<option>Male</option>
<option>Female</option>

</select>

<input
className="border p-2 rounded"
name="qualification"
placeholder="Qualification"
value={lead.qualification}
onChange={handleChange}
/>

<input
className="border p-2 rounded"
name="school_name"
placeholder="School"
value={lead.school_name}
onChange={handleChange}
/>

{/* Year Dropdown */}

<select
className="border p-2 rounded"
name="year_of_passing"
value={lead.year_of_passing}
onChange={handleChange}
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
className="border p-2 rounded"
name="city"
placeholder="City"
value={lead.city}
onChange={handleChange}
/>

<input
className="border p-2 rounded"
name="state"
placeholder="State"
value={lead.state}
onChange={handleChange}
/>

<input
className="border p-2 rounded"
name="country"
placeholder="Country"
value={lead.country}
onChange={handleChange}
/>


{/* Course Dropdown */}

<select
className="border p-2 rounded"
name="interested_course"
value={lead.interested_course}
onChange={handleChange}
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
<select
className="border p-2 rounded"
name="status"
value={lead.status}
onChange={handleChange}
>

<option value="">Select Status</option>

<option value="new">New</option>

<option value="contacted">Contacted</option>

<option value="interested">Interested</option>

<option value="converted">Converted</option>

<option value="dropped">Dropped</option>

</select>

<select
className="border p-2 rounded"
name="temperature"
value={lead.temperature}
onChange={handleChange}
>

<option value="">Temperature</option>

<option value="cold">Cold</option>

<option value="warm">Warm</option>

<option value="hot">Hot</option>

</select>
{/* Lead Source */}

<select
className="border p-2 rounded"
name="lead_source"
value={lead.lead_source}
onChange={handleChange}
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

</select>


{/* Counsellor Dropdown */}

<select
className="border p-2 rounded"
name="assigned_counsellor"
value={lead.assigned_counsellor}
onChange={handleChange}
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
className="border p-2 rounded"
name="next_followup"
value={lead.next_followup}
onChange={handleChange}
/>

</div>

<button
onClick={saveLead}
className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
>

Save Lead

</button>

</div>

</div>

)

}