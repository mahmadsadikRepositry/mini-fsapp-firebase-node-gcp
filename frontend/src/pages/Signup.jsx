import SignupForm from "../auth/Signup";
import { Paper } from "@mui/material";

export default function Signup() {
  return (
    <Paper className="p-8 shadow-lg rounded-xl">
      <SignupForm />
    </Paper>
  );
}
