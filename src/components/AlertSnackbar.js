import { Snackbar } from "@mui/material";
import React, { useState } from "react";
import { CryptoState } from "../CryptoContext";
import MuiAlert from "@material-ui/lab/Alert";

function AlertSnackbar() {
  const { alert, setAlert } = CryptoState();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({ open: false });
  };

  return (
    <Snackbar open={alert.open} autoHideDuration={5000} onClose={handleClose}>
      <MuiAlert
        onClose={handleClose}
        elevation={10}
        variant="filled"
        severity={alert.type}
      >
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
}

export default AlertSnackbar;
