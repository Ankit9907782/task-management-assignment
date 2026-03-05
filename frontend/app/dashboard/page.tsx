"use client";

import { useEffect, useState } from "react";
import { getTasks, deleteTask, toggleTask } from "../services/taskService";
import { Task } from "../types/task";

export default function Dashboard() {

  const [tasks,setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(()=>{
    loadTasks();
  },[]);

  const handleDelete = async(id:number)=>{
    await deleteTask(id);
    loadTasks();
  }

  return(

    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Task Dashboard
      </h1>
      
      {tasks.map(task=>(
        <div
        key={task.id}
        className="border p-4 mb-4 flex justify-between"
        >

          <div>
            <h3 className="font-bold">{task.title}</h3>
            <p>{task.description}</p>
          </div>

          <button
          onClick={()=>handleDelete(task.id)}
          className="bg-red-500 text-white px-3 py-1"
          >
            Delete
          </button>
          <button
onClick={()=>toggleTask(task.id)}
className="bg-green-500 text-white px-3 py-1 mr-2"
>
Toggle
</button>
        </div>
      ))}

    </div>

  )
}