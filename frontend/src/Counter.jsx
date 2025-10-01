import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, setDoc, updateDoc, onSnapshot, increment } from "firebase/firestore";
import { Button, Typography, Paper } from "@mui/material";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const ref = doc(db, "users", uid);

    const unsub = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setCount(docSnap.data().counter || 0);
      }
    });

    return () => unsub();
  }, []);

  const incrementCount = async () => {
    const uid = auth.currentUser.uid;
    const ref = doc(db, "users", uid);
    await setDoc(ref, { counter: 0 }, { merge: true });
    await updateDoc(ref, { counter: increment(1) });
  };

  return (
    <Paper className="p-6 text-center shadow-lg rounded-xl">
      <Typography variant="h5" gutterBottom>
        Your Counter
      </Typography>
      <Typography variant="h3" color="primary" gutterBottom>
        {count}
      </Typography>
      <Button variant="contained" onClick={incrementCount}>
        Click Me
      </Button>
    </Paper>
  );
}
