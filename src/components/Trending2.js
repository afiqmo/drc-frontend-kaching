import { Typography, makeStyles } from "@material-ui/core";
import React from "react";
import ScrollHorizontal from "./ScrollHorizontal";
import TrendHorizontal from "./TrendHorizontal";
import Pacman from "../asset/all-coins.gif";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    padding: 50,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      alignItems: "center",
      padding: 20,
    },
  },
  left: {
    width: "30%",
    padding: 50,
    marginLeft: 130,
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: 20,
      marginLeft: 0,
    },
  },
  right: {
    display: "flex",
    marginRight: 50,
    marginTop: 70,
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  leftSub: {
    paddingRight: 20,
    paddingLeft: 20,
    fontFamily: "VT323",
    marginBottom: 30,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
}));

function Trending2() {
  const classes = useStyles();

  return (
    <div
      style={{
        marginTop: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className={classes.container}>
        <div className={classes.left}>
          <Typography
            className={classes.leftSub}
            variant="h1"
            style={{
              color: "#FFE227",
            }}
          >
            Coins
          </Typography>
          <Typography
            className={classes.leftSub}
            variant="h3"
            style={{
              color: "white",
            }}
          >
            Top trending coins searched by users
          </Typography>
        </div>
        <div className={classes.right}>
          <img src={Pacman} alt="pacman eating coins" width={800} />
        </div>
      </div>

      <TrendHorizontal />
    </div>
  );
}

export default Trending2;
