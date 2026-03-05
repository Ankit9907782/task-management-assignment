import { apiFetch } from "../lib/axios";

export const getTasks = () => {
  return apiFetch("/tasks");
};

export const createTask = (data:any) => {
  return apiFetch("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateTask = (id:number,data:any) => {
  return apiFetch(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteTask = (id:number) => {
  return apiFetch(`/tasks/${id}`, {
    method: "DELETE",
  });
};

const toggleTask = async(id:number)=>{
  await apiFetch(`/tasks/${id}/toggle`,{
    method:"PATCH"
  });

  loadTasks();
}