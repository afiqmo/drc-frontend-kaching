import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { CryptoState } from "../CryptoContext";
import { makeStyles, TextField } from "@material-ui/core";
import WinSound from "../asset/winsound.mp3";

const useStyle = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "25%",
    backgroundColor: "#121212",
    color: "white",
    boxShadow: 24,
    borderRadius: 10,
    [theme.breakpoints.down("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
}));
export default function CheatModal() {
  const { user, setAlert, balance } = CryptoState();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [cheatCode, setCheatCode] = React.useState("");
  const classes = useStyle();

  const playSound = () => {
    var winSound = new Audio(WinSound);
    winSound.play();

    winSound.onended = () => {
      winSound.remove();
      winSound.setAttribute("src", "");
    };
  };

  const cheatCodeSuccess = async () => {
    const walletRef = await doc(db, "wallet", user.uid);

    if (cheatCode === "42" || cheatCode === 42) {
      try {
        await setDoc(
          walletRef,
          {
            balances: balance
              ? { usd: balance.usd + 1000000, btc: balance.btc + 1 }
              : { usd: 1000000, btc: 1 },
          },
          { merge: "true" }
        );
        setAlert({
          open: true,
          message: `CONGRATULATION, YOU JUST WON $1000000!`,
          type: "success",
        });

        handleClose();
        playSound();
      } catch (error) {}
    } else {
      setAlert({
        open: true,
        message: `oops, wrong answer!`,
        type: "error",
      });
    }
  };

  return (
    <div>
      <Typography onClick={handleOpen}>Balance</Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.paper}>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              marginLeft: "50px",
              marginRight: "50px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              What's the answer to the question?
            </Typography>
            <TextField
              type="string"
              variant="outlined"
              label="Enter your answer"
              value={cheatCode}
              onChange={(e) => {
                setCheatCode(e.target.value);
              }}
              fullWidth
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "80%",
              }}
            >
              <Button
                style={{
                  backgroundColor: "#FFE227",
                  border: "5px solid white",
                  color: "black",
                  fontFamily: "VT323",
                  fontSize: 16,
                  width: "40%",
                }}
                onClick={() => {
                  cheatCodeSuccess();
                }}
              >
                Submit
              </Button>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
