import { useState } from "react"
import API from "../api/api"

export default function Login(){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")
const [loading,setLoading] = useState(false)

const handleLogin = async ()=>{

try{

setLoading(true)

const res = await API.post("/users/login",null,{
params:{
username:username,
password:password
}
})

localStorage.setItem("token",res.data.access_token)
localStorage.setItem("user",res.data.user)
localStorage.setItem("role",res.data.role)   // ✅ IMPORTANT
localStorage.setItem("user_id",res.data.user_id)

// reload so sidebar detects role
window.location.href="/"

}catch(err){

alert("Invalid username or password")

}finally{

setLoading(false)

}

}

return(

<div className="flex items-center justify-center h-screen bg-gray-100">

<div className="bg-white p-8 shadow rounded w-96">

<h1 className="text-2xl font-bold mb-6">
CRM Login
</h1>

<input
placeholder="Mobile"
className="border p-2 w-full mb-4"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="border p-2 w-full mb-4"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={handleLogin}
disabled={loading}
className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
>

{loading ? "Logging in..." : "Login"}

</button>

</div>

</div>

)

}