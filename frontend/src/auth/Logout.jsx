import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Button } from "@mui/material";

export default function Logout() {
  return (
    <Button color="inherit" onClick={() => signOut(auth)}>
      Logout
    </Button>
  );
}
