import * as React from "react";

import { Tooltip, makeStyles } from "@material-ui/core";
import { doc, setDoc } from "firebase/firestore";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { CryptoState } from "../CryptoContext";
import DeleteIcon from "../asset/deleteicon.png";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { db } from "../firebase";
import { style } from "@mui/system";

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
export default function DeleteModal(row) {
  const { user, setAlert, watchlist, coins, currency, symbol } = CryptoState();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const classes = useStyle();

  const setHoldingWatchlist = async (coin) => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.map((watch) =>
            watch.id === coin?.id
              ? { id: coin.id, holding: 0 }
              : { id: watch.id, holding: watch.holding }
          ),
        },
        { merge: "true" }
      );
    } catch (error) {}

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch.id !== coin?.id),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from your portfolio`,
        type: "success",
      });
    } catch (error) {}
  };

  return (
    <div>
      <Tooltip title="Delete Coin">
        <img
          src={DeleteIcon}
          height={20}
          style={{ cursor: "pointer" }}
          onClick={handleOpen}
        />
      </Tooltip>

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
              gap: "20px",
              marginLeft: "50px",
              marginRight: "50px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Delete {row?.row?.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete {row?.row?.name}?
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
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
                  handleClose();
                }}
              >
                Cancel
              </Button>
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
                  setHoldingWatchlist(row?.row);
                  handleClose();
                }}
              >
                Delete
              </Button>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
