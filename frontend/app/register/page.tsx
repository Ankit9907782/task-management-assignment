"use client";

import { useState } from "react";

export default function RegisterPage(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = async (e:any)=>{
    e.preventDefault();

    await fetch("http://localhost:5000/auth/register",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    });

    window.location.href="/login";
  }

  return(
    <div className="flex justify-center items-center h-screen">

      <form
      onSubmit={handleRegister}
      className="flex flex-col gap-4 w-80"
      >

      <h1 className="text-2xl font-bold">
      Register
      </h1>

      <input
      className="border p-2"
      placeholder="Email"
      onChange={(e)=>setEmail(e.target.value)}
      />

      <input
      className="border p-2"
      type="password"
      placeholder="Password"
      onChange={(e)=>setPassword(e.target.value)}
      />

      <button
      className="bg-black text-white p-2"
      >
      Register
      </button>

      </form>

    </div>
  )
}