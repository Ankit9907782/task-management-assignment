"use client";

import { useState } from "react";

export default function LoginPage() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async (e:any)=>{
    e.preventDefault();

    const res = await fetch("http://localhost:5000/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    });

    const data = await res.json();

    localStorage.setItem("accessToken",data.accessToken);

    window.location.href="/dashboard";
  }

  return (
    <div className="flex justify-center items-center h-screen">

      <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 w-80"
      >

        <h1 className="text-2xl font-bold">
        Login
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
        type="submit"
        >
        Login
        </button>

      </form>

    </div>
  )
}