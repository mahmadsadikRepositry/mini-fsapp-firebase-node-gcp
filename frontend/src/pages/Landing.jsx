import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { Button, Typography, Paper } from "@mui/material";

export default function Landing() {
  const [user] = useAuthState(auth);

  return (
    <Paper className="p-8 text-center shadow-lg rounded-xl">
      <Typography variant="h4" gutterBottom>
        Welcome to the Mini Project
      </Typography>
      {!user ? (
        <>
          <Typography>Login to continue or sign up as a new user.</Typography>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/login"><Button variant="contained">Login</Button></Link>
            <Link to="/signup"><Button variant="outlined">Sign Up</Button></Link>
          </div>
        </>
      ) : (
        <>
          <Typography>Welcome back, {user.email}!</Typography>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/dashboard"><Button variant="contained">Go to Dashboard</Button></Link>
            <Link to="/profile"><Button variant="outlined">Profile</Button></Link>
          </div>
        </>
      )}
    </Paper>
  );
}
