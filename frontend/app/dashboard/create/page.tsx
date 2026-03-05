"use client";

import { useState } from "react";
import { createTask } from "../services/taskService";

export default function CreateTask(){

  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");

  const handleSubmit = async(e:any)=>{
    e.preventDefault();

    await createTask({
      title,
      description
    });

    window.location.href="/dashboard";
  }

  return(

    <div className="p-10">

      <h1 className="text-2xl font-bold mb-4">
      Create Task
      </h1>

      <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-96"
      >

      <input
      className="border p-2"
      placeholder="Title"
      onChange={(e)=>setTitle(e.target.value)}
      />

      <textarea
      className="border p-2"
      placeholder="Description"
      onChange={(e)=>setDescription(e.target.value)}
      />

      <button
      className="bg-black text-white p-2"
      >
      Create
      </button>

      </form>

    </div>

  )
}