import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Typography } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col w-full space-y-3">
      <Typography variant="h6">Log In</Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" variant="contained" color="secondary">
        Log In
      </Button>
    </form>
  );
}
