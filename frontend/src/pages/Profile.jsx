import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Typography, Paper } from "@mui/material";
import Logout from "../auth/Logout";

export default function Profile() {
  const [user] = useAuthState(auth);

  return (
    <Paper className="p-8 shadow-lg rounded-xl">
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>
      <Typography>Email: {user?.email}</Typography>
      <div className="mt-4">
        <Logout />
      </div>
    </Paper>
  );
}
