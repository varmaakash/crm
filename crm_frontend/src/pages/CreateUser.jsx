import { useState } from "react"
import API from "../api/api"

export default function CreateUser(){

const [fullName,setFullName] = useState("")
const [mobile,setMobile] = useState("")
const [password,setPassword] = useState("")
const [role,setRole] = useState("counsellor")

const createUser = async()=>{

try{

await API.post("/auth/register",{
full_name:fullName,
mobile:mobile,
password:password,
role:role
})

alert("User Created Successfully")

setFullName("")
setMobile("")
setPassword("")

}catch(err){

alert("User Creation Failed")

}

}

return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">
Create User
</h1>

<div className="bg-white p-6 shadow rounded w-96">

<input
placeholder="Full Name"
className="border p-2 w-full mb-3"
value={fullName}
onChange={(e)=>setFullName(e.target.value)}
/>

<input
placeholder="Mobile"
className="border p-2 w-full mb-3"
value={mobile}
onChange={(e)=>setMobile(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-3"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<select
className="border p-2 w-full mb-3"
value={role}
onChange={(e)=>setRole(e.target.value)}
>

<option value="admin">Admin</option>
<option value="counsellor">Counsellor</option>

</select>

<button
onClick={createUser}
className="bg-green-600 text-white w-full py-2 rounded"
>

Create User

</button>

</div>

</div>

)

}