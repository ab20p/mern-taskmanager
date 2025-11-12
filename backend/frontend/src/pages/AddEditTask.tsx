import { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AddEditTask() {
  const [task, setTask] = useState({ title: "", description: "", status: "Pending" });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.get("/tasks").then((res) => {
        const t = res.data.find((item: any) => item._id === id);
        if (t) setTask(t);
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (id) await api.put(`/tasks/${id}`, task);
    else await api.post("/tasks", task);
    navigate("/dashboard");
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 10 }}>
      <Typography variant="h5">{id ? "Edit Task" : "Add Task"}</Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <TextField
        select
        label="Status"
        fullWidth
        margin="normal"
        value={task.status}
        onChange={(e) => setTask({ ...task, status: e.target.value })}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </TextField>
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
        {id ? "Update Task" : "Create Task"}
      </Button>
    </Box>
  );
}
