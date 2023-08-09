import { makeStyles, TableContainer, Typography } from "@material-ui/core";

import React from "react";
import { CryptoState } from "../CryptoContext";
import bestperformanceicon from "../asset/best-performer.png";
import worstperformericon from "../asset/worst-performer.png";
import bell from "../asset/alert.png";
import currentbalance from "../asset/current-balance .png";
import Service from "../service/Service";

const useStyles = makeStyles((theme) => ({
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 20,
    width: "25%",
    margin: 15,
    borderRadius: "15px",
    background: "rgba(79, 58, 84, 0.52)",
    minHeight: "185px",
    [theme.breakpoints.down("md")]: {
      width: "50%",
      alignItems: "flex-start",
    },
    [theme.breakpoints.down("xs")]: {
      width: "90%",
      alignItems: "flex-start",
    },
  },
  portfolioContainer: {
    padding: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  redColor: {
    color: "#FF0000",
  },
  greenColor: {
    color: "#33FF00",
  },
  red: {
    backgroundColor: "#FF0000",
    marginLeft: 10,
    color: "black",
    padding: 5,
    borderRadius: 5,
  },
  green: {
    backgroundColor: "#33FF00",
    marginLeft: 10,
    color: "black",
    padding: 5,
    borderRadius: 5,
  },
}));

function Portfolioinfo({
  avgPriceChange,
  topPerformCoin,
  Worst,
  alert,
  period,
  timeFrame,
}) {
  const classes = useStyles();
  const { currency, symbol, watchlist } = CryptoState();

  const alerts = alert?.map((coin) => {
    if (watchlist?.includes(watchlist?.find((watch) => watch.id === coin.id))) {
      return (
        <div style={{ display: "flex", alignItems: "center", padding: 5 }}>
          <img
            src={coin?.image?.small}
            height="30"
            style={{ marginRight: 10 }}
          />
          <Typography>{coin?.name}</Typography>
        </div>
      );
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div className={classes.portfolioContainer}>
        <div
          data-aos="zoom-in-down"
          data-aos-duration="1500"
          className={classes.infoContainer}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <img src={currentbalance} height="30" />

          <Typography>Profit Estimation ({timeFrame})</Typography>
          <Typography
            variant="h4"
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
            }}
          >
            {" "}
            <div
              className={
                avgPriceChange > 0 ? classes.greenColor : classes.redColor
              }
              style={{
                width: "80%",
                display: "flex",
                justifyContent: "center",
                fontFamily: "VT323",
              }}
            >
              {Service.isProfit(avgPriceChange) ? "+" : ""}
              {avgPriceChange ? avgPriceChange?.toFixed(2) : ""} {"%"}
            </div>
          </Typography>
        </div>
        <div
          data-aos="zoom-in-down"
          data-aos-duration="1500"
          className={classes.infoContainer}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90%",
            }}
          >
            <div>
              <img src={bestperformanceicon} alt="best coin Icon" height="30" />
            </div>
            <div
              className={
                topPerformCoin?.market_data[period] > 0
                  ? classes.green
                  : classes.red
              }
            >
              {" "}
              {Service.isProfit(topPerformCoin?.market_data[period]) ? "+" : ""}
              {`${topPerformCoin?.market_data[period]?.toFixed(2)} %`}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "90%",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              style={{
                width: "max-content",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              Top Performance Coin ({timeFrame})
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90%",
            }}
          >
            {" "}
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={topPerformCoin?.image?.large}
                height="30"
                style={{ marginRight: 10 }}
              />
              <Typography>{topPerformCoin?.symbol?.toUpperCase()}</Typography>
            </div>
            <div>
              {symbol}
              {topPerformCoin?.market_data?.current_price[
                currency.toLowerCase()
              ]?.toPrecision(4)}
            </div>
          </div>
        </div>
        <div
          data-aos="zoom-in-down"
          data-aos-duration="1500"
          className={classes.infoContainer}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90%",
            }}
          >
            <div>
              <img src={worstperformericon} alt="worst coin Icon" height="30" />
            </div>
            <div
              className={
                Worst?.market_data[period] > 0 ? classes.green : classes.red
              }
            >
              {`${Worst?.market_data[period]?.toFixed(2)} %`}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "90%",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              style={{
                width: "max-content",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              Worst Performance Coin ({timeFrame})
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={Worst?.image?.large}
                height="30"
                style={{ marginRight: 10 }}
              />
              <Typography>{Worst?.symbol?.toUpperCase()}</Typography>
            </div>

            <div>
              {symbol}
              {Worst?.market_data?.current_price[currency.toLowerCase()]}
            </div>
          </div>
        </div>
        <div
          data-aos="zoom-in-down"
          data-aos-duration="1500"
          className={classes.infoContainer}
        >
          <div
            style={{
              display: "flex",
              width: "90%",
              justifyContent: "flex-start",
            }}
          >
            <img src={bell} alt="alert Icon" height="30" />
          </div>
          <div
            style={{
              display: "flex",
              width: "90%",
              justifyContent: "flex-start",
            }}
          >
            <Typography
              style={{
                width: "max-content",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              Alert Coin (24h)
            </Typography>
          </div>

          <div style={{ width: "100%", overflowY: "auto", maxHeight: "70px" }}>
            {alerts.length == 0 ? (
              <Typography>no major drop in the last 24h</Typography>
            ) : (
              alerts
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolioinfo;
