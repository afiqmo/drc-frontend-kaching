import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { CryptoState } from "../CryptoContext";
import MarketCapIcon from "../asset/market-cap.png";
import Icon24h from "../asset/24h.png";
import DominanceIcon from "../asset/dominance.png";
import CoinMarketIcon from "../asset/coin-count.png";
import pixel from "../asset/pixelated_1.png";

const useStyles = makeStyles((theme) => ({
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 30,
    paddingLeft: 90,
    paddingRight: 90,
    margin: 15,
    borderRadius: "15px",
    background: "rgba(79, 58, 84, 0.52)",
  },
  marketContainer: {
    marginTop: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  marketSub: {
    fontFamily: "VT323",
    color: "white",
    fontSize: "50px",
    [theme.breakpoints.down("md")]: {
      fontSize: "34px",
      paddingRight: 30,
      paddingLeft: 30,
      alignItems: "center",
    },
  },
}));

function GlobalMarket() {
  const classes = useStyles();

  const { globalInfo, currency, symbol } = CryptoState();

  return (
    <div
      style={{
        marginTop: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#6B0D74",
      }}
    >
      <img
        src={pixel}
        style={{
          position: "relative",
          transform: "rotate(180deg)",
          width: "100%",
        }}
      ></img>
      <Typography
        variant="h2"
        style={{
          paddingRight: 20,
          paddingLeft: 20,
          fontFamily: "VT323",
          color: "#FFE227",
        }}
      >
        Global Market
      </Typography>
      <Typography className={classes.marketSub}>
        Overview of the latest global market data
      </Typography>
      <div className={classes.marketContainer}>
        <div className={classes.infoContainer}>
          <Typography style={{ fontWeight: "bold" }}>Market Cap</Typography>
          <Typography>
            {symbol}{" "}
            {Math.round(
              globalInfo?.data?.total_market_cap[currency.toLowerCase()]
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              .slice(0, -8)}
            {" Million"}
          </Typography>
          <img
            src={MarketCapIcon}
            alt="Market Cap Icon"
            height="100"
            style={{ marginTop: 20 }}
          />
        </div>
        <div className={classes.infoContainer}>
          <Typography style={{ fontWeight: "bold" }}>Volume 24h</Typography>
          <Typography>
            {symbol}{" "}
            {Math.round(globalInfo?.data?.total_volume[currency.toLowerCase()])
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              .slice(0, -8)}
            {" Million"}
          </Typography>
          <img
            src={Icon24h}
            alt="24h Icon"
            height="100"
            style={{ marginTop: 20 }}
          />
        </div>
        <div className={classes.infoContainer}>
          <Typography style={{ fontWeight: "bold" }}>BTC Dominance</Typography>
          <Typography>
            {globalInfo?.data?.market_cap_percentage?.btc.toFixed(2)}
            {"%"}
          </Typography>
          <img
            src={DominanceIcon}
            alt="Dominance icon"
            height="100"
            style={{ marginTop: 20 }}
          />
        </div>
        <div className={classes.infoContainer}>
          <Typography style={{ fontWeight: "bold" }}>Active Coins</Typography>
          <Typography>{globalInfo?.data?.active_cryptocurrencies}</Typography>
          <img
            src={CoinMarketIcon}
            alt="Coin Market Icon"
            height="100"
            style={{ marginTop: 20 }}
          />
        </div>
      </div>
      <img
        src={pixel}
        style={{
          position: "relative",
          width: "100%",
        }}
      ></img>
    </div>
  );
}

export default GlobalMarket;
