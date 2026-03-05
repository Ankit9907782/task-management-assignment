"use client";

import { useEffect, useState } from "react";
import { updateTask, apiFetch } from "@/services/taskService";
import { useParams } from "next/navigation";

export default function EditTask() {

  const params = useParams();
  const id = params.id as string;

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");

  useEffect(()=>{
    loadTask();
  },[]);

  const loadTask = async()=>{
    const task = await apiFetch(`/tasks?page=1&search=&id=${id}`);
    setTitle(task.title);
    setDescription(task.description);
  }

  const handleSubmit = async(e:any)=>{
    e.preventDefault();

    await updateTask(Number(id),{
      title,
      description
    });

    window.location.href="/dashboard";
  }

  return(
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-4">
        Edit Task
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">

        <input
          className="border p-2"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          placeholder="Title"
        />

        <textarea
          className="border p-2"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          placeholder="Description"
        />

        <button className="bg-black text-white p-2">
          Update Task
        </button>

      </form>

    </div>
  )
}