import Counter from "../Counter";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Typography, Paper } from "@mui/material";

export default function Dashboard() {
  const [user] = useAuthState(auth);

  return (
    <Paper className="p-8 shadow-lg rounded-xl">
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom>
        Logged in as: {user?.email}
      </Typography>
      <Counter />
    </Paper>
  );
}
