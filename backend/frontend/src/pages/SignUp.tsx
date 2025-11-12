import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post("/signup", form);
      navigate("/");
    } catch(err) {
      console.log("Signup failed",err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 10 }}>
      <Typography variant="h5" mb={2}>Create Account</Typography>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Sign Up
      </Button>
      <Button onClick={() => navigate("/")}>Already have an account? Sign In</Button>
    </Box>
  );
}
