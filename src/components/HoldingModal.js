import * as React from "react";
import Modal from "@mui/material/Modal";
import {
  Box,
  Button,
  createTheme,
  makeStyles,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { CryptoState } from "../CryptoContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import EditIcon from "../asset/edit.png";

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

export default function HoldingModal({ coin }) {
  const { currency, setAlert, watchlist, user } = CryptoState();

  const [openHolding, setOpenHolding] = React.useState(false);
  const [newHolding, setNewHolding] = React.useState("");
  const [newHoldingQuantity, setNewHoldingQuantity] = React.useState("");

  const [newHolding2, setNewHolding2] = React.useState(0);

  const handleOpen = () => setOpenHolding(true);
  const handleClose = () => setOpenHolding(false);

  const setHoldingWatchlist = async () => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.map((watch) =>
            watch.id === coin?.id
              ? { id: coin.id, holding: newHolding2 }
              : { id: watch.id, holding: watch.holding }
          ),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `You have change your ${coin?.name} holding to ${newHolding} ${currency} (${newHolding2} unit)`,
        type: "success",
      });
    } catch (error) {}
  };
  const handleSubmit = () => {
    if (!newHolding) {
      setAlert({
        open: true,
        message: "Please fill in the required information",
        type: "error",
      });
    } else if (newHolding <= 0) {
      setAlert({
        open: true,
        message: "Invalid Input",
        type: "error",
      });
    } else {
      setHoldingWatchlist();
      handleClose();
    }
  };

  const classes = useStyle();

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  React.useEffect(() => {
    setNewHolding2(
      newHolding / coin?.market_data?.current_price[currency.toLowerCase()]
    );
  }, [newHolding]);

  const holdingPlaceHolder = `Enter Holding amount in ${currency}`;
  return (
    <>
      {" "}
      <ThemeProvider theme={darkTheme}>
        <Tooltip title="Edit holding amount">
          <img
            src={EditIcon}
            height={20}
            onClick={handleOpen}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>

        <Modal open={openHolding} onClose={handleClose}>
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
              {" "}
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {" "}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h5" style={{ fontFamily: "VT323" }}>
                    1 {coin?.name} ={" "}
                    {coin?.market_data?.current_price[currency.toLowerCase()]}
                    {currency}
                  </Typography>
                </div>
                <TextField
                  variant="outlined"
                  type="number"
                  label={holdingPlaceHolder}
                  value={newHolding}
                  onChange={(e) => {
                    setNewHolding(e.target.value);
                    setNewHoldingQuantity(
                      e.target.value /
                        coin?.market_data?.current_price[
                          currency?.toLowerCase()
                        ]
                    );
                  }}
                  fullWidth
                />
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
                    or
                  </p>
                  <div
                    style={{
                      width: "150px",
                    }}
                  >
                    <hr></hr>
                  </div>
                </div>
                <TextField
                  variant="outlined"
                  type="number"
                  label="Enter Coin Quantity"
                  value={newHoldingQuantity}
                  onChange={(e) => {
                    setNewHoldingQuantity(e.target.value);
                    setNewHolding(
                      e.target.value *
                        coin?.market_data?.current_price[currency.toLowerCase()]
                    );
                  }}
                  fullWidth
                />
                <Button
                  variant="contained"
                  style={{ backgroundColor: "yellow", color: "black" }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </div>
        </Modal>
      </ThemeProvider>
    </>
  );
}
