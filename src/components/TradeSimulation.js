import { Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import TradePic from "../asset/trading.gif";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    padding: 50,
    marginTop: -10,
    paddingTop: 0,
    background:
      "linear-gradient(180deg, rgba(107,13,116,1) 0%, rgba(33,33,33,1) 100%)",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      alignItems: "center",
      paddingRight: "20",
      paddingLeft: "20",
    },
  },
  left: {
    padding: 50,
    paddingTop: 0,
    width: "40%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    width: "60%",
    padding: 50,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "center",
      padding: 0,
    },
  },
  TradeRight: {
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
  TradeSub: {
    fontFamily: "VT323",
    color: "white",
    marginBottom: 50,
    fontSize: "50px",
    [theme.breakpoints.down("md")]: {
      fontSize: "34px",
    },
  },
  tradeGif: {
    height: "60%",
    [theme.breakpoints.down("md")]: {
      marginTop: 40,
      height: "150px",
      width: "auto",
      display: "flex",
    },
  },
}));

function TradeSimulation() {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <img src={TradePic} alt="trade pic" className={classes.tradeGif} />
      </div>
      <div className={classes.right}>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div className={classes.TradeRight}>
            <Typography
              variant="h2"
              style={{
                fontFamily: "VT323",
                color: "#FFE227",
                marginBottom: 50,
              }}
            >
              Trading Simulation
            </Typography>
            <Typography className={classes.TradeSub}>
              Experience stock market trading without risking any capital
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
                navigate("/trade");
              }}
            >
              Trade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradeSimulation;
