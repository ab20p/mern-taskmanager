import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Chip,
  IconButton,
  CssBaseline,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Create theme dynamically
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "#f9fafc" : "#121212",
            paper: mode === "light" ? "#fff" : "#1e1e1e",
          },
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this task?")) {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    }
  };

  // Count tasks by status
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const total = tasks.length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            backgroundColor: "background.paper",
            p: 2.5,
            borderRadius: 2,
            boxShadow:
              mode === "light"
                ? "0 2px 8px rgba(0,0,0,0.05)"
                : "0 2px 8px rgba(255,255,255,0.05)",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Welcome back, {user?.name || "User"} 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here's an overview of your tasks
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={toggleTheme} sx={{ mr: 2 }}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <Button
              startIcon={<AddCircleIcon />}
              variant="contained"
              sx={{ mr: 2 }}
              onClick={() => navigate("/task")}
            >
              Add Task
            </Button>
            <Button
              startIcon={<LogoutIcon />}
              variant="outlined"
              color="error"
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Summary Section */}
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderLeft: "5px solid #1976d2",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Total Tasks</Typography>
              <Typography variant="h4" color="primary">
                {total}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderLeft: "5px solid #ed6c02",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h4" color="warning.main">
                {pending}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderLeft: "5px solid #2e7d32",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">Completed</Typography>
              <Typography variant="h4" color="success.main">
                {completed}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Task Cards */}
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow:
                      mode === "light"
                        ? "0 6px 16px rgba(0,0,0,0.1)"
                        : "0 6px 16px rgba(255,255,255,0.05)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {task.description || "No description provided."}
                  </Typography>

                  <Chip
                    label={task.status.toUpperCase()}
                    color={
                      task.status === "Completed"
                        ? "success"
                        : task.status === "Pending"
                        ? "warning"
                        : "default"
                    }
                    sx={{ mb: 2 }}
                  />

                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<EditIcon />}
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/task/${task._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      variant="outlined"
                      size="small"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {tasks.length === 0 && (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                mt: 5,
                color: "text.secondary",
              }}
            >
              <Typography variant="h6">No tasks yet</Typography>
              <Typography variant="body2">
                Start by adding your first task ✨
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
