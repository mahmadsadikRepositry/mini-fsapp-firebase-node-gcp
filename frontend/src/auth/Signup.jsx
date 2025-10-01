import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Typography } from "@mui/material";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col w-full space-y-3">
      <Typography variant="h6">Sign Up</Typography>
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
      <Button type="submit" variant="contained" color="primary">
        Create Account
      </Button>
    </form>
  );
}
