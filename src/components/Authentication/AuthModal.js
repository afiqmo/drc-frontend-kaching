import * as React from "react";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";
import Login from "./Login";
import Signup from "./Signup";
import { AppBar, makeStyles } from "@material-ui/core";
import { CryptoState } from "../../CryptoContext";

const useStyle = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    // height: "800px",
    backgroundColor: "#1E1D1D",
    color: "white",
    boxShadow: "inset 1px 1px 5px #FFE227",
    borderRadius: 10,
    [theme.breakpoints.down("sm")]: {
      width: "80%",
      height: "70%",
    },
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: 20,
  },
  googleSignIn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "0",
    marginRight: "0",
    marginBottom: "10px",
    [theme.breakpoints.down("md")]: {
      marginLeft: "0",
      marginRight: "0",
      height: "30%",
    },
  },
}));

export default function AuthModal() {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { setAlert, open, setOpen, authValue, setAuthValue } = CryptoState();

  const classes = useStyle();

  const handleChange = (event, newValue) => {
    setAuthValue(newValue);
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
          setAuthValue(0);
        }}
        style={{
          backgroundColor: "#FFE227",
          border: "5px solid white",
          color: "black",
          fontFamily: "VT323",
          fontSize: 16,
        }}
      >
        Login
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.paper}>
          <AppBar
            position="static"
            style={{
              backgroundColor: "transparent",
              color: "white",
              height: "100%",
            }}
          >
            <Tabs variant="fullWidth" value={authValue} onChange={handleChange}>
              <Tab
                style={
                  authValue === 0
                    ? {
                        color: "black",
                        backgroundColor: "#FFE227",
                        fontWeight: "bold",
                      }
                    : { color: "white" }
                }
                label="Login"
              />
              <Tab
                style={
                  authValue === 1
                    ? {
                        color: "black",
                        backgroundColor: "#FFE227",
                        fontWeight: "bold",
                      }
                    : { color: "white" }
                }
                label="Sign Up"
              />
            </Tabs>
            <div style={{ padding: 20, height: "100%" }}>
              {authValue === 0 && <Login handleClose={handleClose} />}
              {authValue === 1 && <Signup handleClose={handleClose} />}
            </div>
          </AppBar>
        </div>
      </Modal>
    </div>
  );
}
