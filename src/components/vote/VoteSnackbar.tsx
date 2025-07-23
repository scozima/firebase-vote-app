import { Snackbar, Alert } from "@mui/material";
import type { SnackbarState } from "../../types/vote";

interface VoteSnackbarProps {
  snackbar: SnackbarState;
  onClose: () => void;
}

export const VoteSnackbar = ({ snackbar, onClose }: VoteSnackbarProps) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={snackbar.severity} sx={{ width: "100%" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}; 