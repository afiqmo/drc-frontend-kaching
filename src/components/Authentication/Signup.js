import { Box, Button, TextField, makeStyles } from "@material-ui/core";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";
import LogoIcon from "../../asset/logoicon.png";
import LogoWord from "../../asset/logoword.png";

const useStyles = makeStyles((theme) => ({
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginLeft: "200px",
    marginRight: "200px",
    marginTop: "50px",
    marginBottom: "10px",
    [theme.breakpoints.down("md")]: {
      margin: "0",
      overflowY: "scroll",
      height: "90%",
      overflowY: "auto",
      maxHeight: "500px",
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

function Signup({ handleClose }) {
  const [username, setName] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setAlert, setAuthValue, authValue } = CryptoState();
  const classes = useStyles();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match",
        type: "error",
      });
    } else if (!email || !password || !confirmPassword) {
      setAlert({
        open: true,
        message: "Please fill in the required information",
        type: "error",
      });
    } else {
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setAlert({
          open: true,
          message: `Welcome abroad ${result.user.email}`,
          type: "success",
        });
        handleClose();
      } catch (error) {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
      }
    }
  };

  const googleProvider = new GoogleAuthProvider();
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Welcome ${res.user.email}`,
          type: "success",
        });

        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
        return;
      });
  };

  return (
    <Box p={3} className={classes.box}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={LogoWord} width="200" />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1> Create Account</h1>
      </div>
      <div
        style={{
          display: "flex",

          justifyContent: "center",
        }}
      >
        <span>Enter your details or continue with Google</span>
      </div>
      <TextField
        variant="outlined"
        type="email"
        label="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        type="password"
        label="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        style={{
          backgroundColor: "#FFE227",
          border: "5px solid white",
          color: "black",
          fontFamily: "VT323",
          fontSize: 20,
        }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
      <Box className={classes.google}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <div
            style={{
              width: "150px",
            }}
          >
            <hr></hr>
          </div>

          <p
            style={{
              fontSize: "15px",
            }}
          >
            or continue with
          </p>
          <div
            style={{
              width: "150px",
            }}
          >
            <hr></hr>
          </div>
        </div>
        <div className={classes.googleSignIn}>
          <Button
            variant="contained"
            onClick={signInWithGoogle}
            style={{
              backgroundColor: "#212121",
              border: "5px solid #FFE227",
              color: "white",
              fontFamily: "VT323",
              fontSize: 20,
            }}
          >
            Sign In With Google
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {" "}
          {authValue == 0 ? (
            <p>
              Don't have an account?{" "}
              <a
                onClick={() => {
                  setAuthValue(1);
                }}
                style={{ cursor: "pointer" }}
              >
                Sign Up
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <a
                onClick={() => {
                  setAuthValue(0);
                }}
                style={{ cursor: "pointer" }}
              >
                Login{" "}
              </a>
            </p>
          )}
        </div>
      </Box>
    </Box>
  );
}

export default Signup;
