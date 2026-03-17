import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/api"

export default function Register(){

const [fullName,setFullName] = useState("")
const [mobile,setMobile] = useState("")
const [password,setPassword] = useState("")
const [role,setRole] = useState("counsellor")

const navigate = useNavigate()

const handleRegister = async ()=>{

try{

await API.post("/auth/register",{
full_name:fullName,
mobile:mobile,
password:password,
role:role
})

alert("User Registered Successfully")

navigate("/login")

}catch(err){

alert("Registration Failed")

}

}

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<div className="bg-white p-8 shadow rounded w-96">

<h1 className="text-2xl font-bold mb-6">
Register User
</h1>

<input
placeholder="Full Name"
className="border p-2 w-full mb-4"
value={fullName}
onChange={(e)=>setFullName(e.target.value)}
/>

<input
placeholder="Mobile"
className="border p-2 w-full mb-4"
value={mobile}
onChange={(e)=>setMobile(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-4"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<select
className="border p-2 w-full mb-4"
value={role}
onChange={(e)=>setRole(e.target.value)}
>

<option value="admin">Admin</option>
<option value="counsellor">Counsellor</option>

</select>

<button
onClick={handleRegister}
className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
>

Register

</button>

</div>

</div>

)

}