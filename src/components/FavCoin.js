import { Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import CoinPic from "../asset/fav-coin.gif";
import { useNavigate } from "react-router-dom";
import pixel from "../asset/pixelated_1.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    padding: 50,
    paddingTop: 0,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      paddingRight: "20",
      paddingLeft: "20",
    },
  },
  left: {
    width: "50%",
    padding: 50,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "center",
      padding: 0,
    },
  },
  favCoinLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 150,
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 0,
    },
  },
  right: {
    padding: 50,
    paddingTop: 0,
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  favCoinSub: {
    fontFamily: "VT323",
    color: "white",
    marginBottom: 50,
    fontSize: "50px",
    [theme.breakpoints.down("md")]: {
      fontSize: "34px",
    },
  },
  favGif: {
    height: "500px",
    [theme.breakpoints.down("md")]: {
      height: "auto",
      width: "350px",
      display: "flex",
    },
  },
}));

function FavCoin() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div>
      <div className={classes.container}>
        <div className={classes.left}>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div className={classes.favCoinLeft}>
              <Typography
                variant="h2"
                style={{
                  fontFamily: "VT323",
                  color: "#FFE227",
                  marginBottom: 50,
                }}
              >
                Favourite Coins
              </Typography>
              <Typography className={classes.favCoinSub}>
                Save and monitor your favourite coins performance in one place
              </Typography>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#FFE227",
                  color: "black",
                  border: "5px solid white",
                  fontFamily: "VT323",
                  fontSize: 20,
                }}
                onClick={() => {
                  navigate("/coinList");
                }}
              >
                Add Now
              </Button>
            </div>
          </div>
        </div>
        <div className={classes.right}>
          <img src={CoinPic} alt="coin pic" className={classes.favGif} />
        </div>
      </div>
      <img
        src={pixel}
        style={{
          position: "relative",
          width: "100%",
          transform: "rotate(180deg)",
          backgroundColor: "#6B0D74",
        }}
      ></img>
    </div>
  );
}

export default FavCoin;
