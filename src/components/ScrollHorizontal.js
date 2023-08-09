import {
  CircularProgress,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import AliceCarousel from "react-alice-carousel";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";
import SimpleChart from "./SimpleChart";
import { useNavigate } from "react-router-dom";

const useStyle = makeStyles(() => ({
  scrollh: {
    height: "50%",
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollElement: {
    boxShadow: "0px 0px 105px 45px 0px 0px 105px 45px ",
  },
}));

function ScrollHorizontal() {
  const classes = useStyle();
  const navigate = useNavigate();

  const { currency, symbol, setAlert } = CryptoState();

  const [trending, setTrending] = useState([]);

  const getTrendingCoins = (e) => {
    Service.getTrendingCoins(e)
      .then((response) => {
        setTrending(response.data);
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: `${err}`,
          type: "error",
        });
      });
  };

  useEffect(() => {
    getTrendingCoins(currency);
  }, [currency]);

  if (trending.length === 0) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  const responsive = {
    0: { items: 1 },
    824: { items: 2 },
    1150: { items: 3 },
    1600: { items: 4 },
  };

  const items = trending.map((coin) => {
    return (
      <div
        className={classes.scrollElement}
        onClick={() => navigate(`/coins/${coin.id}`)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          padding: 30,
          margin: 15,
          borderRadius: "15px",
          background: "rgba(79, 58, 84, 0.52)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <img src={coin?.image} alt={coin.name} height="70" />
          <div style={{ marginLeft: 10 }}>
            <Typography
              variant="h4"
              style={{ fontWeight: "bold", fontFamily: "VT323" }}
            >
              {coin?.symbol.toUpperCase()}
            </Typography>
            <Typography variant="h6" style={{ fontFamily: "VT323" }}>
              {coin?.name}
            </Typography>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          {" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Typography variant="h4" style={{ fontFamily: "VT323" }}>
              {symbol}
              {coin?.current_price > 1
                ? Service.addCommas(coin?.current_price)
                : coin?.current_price}
            </Typography>
            <div
              style={{
                padding: 5,
                borderRadius: 5,
                backgroundColor:
                  coin?.price_change_percentage_24h > 0 ? "green" : "red",
              }}
            >
              {Service.isProfit(coin?.price_change_percentage_24h) ? "+" : ""}
              {parseFloat(coin?.price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>
          <SimpleChart coin={coin} />
        </div>
      </div>
    );
  });
  return (
    <div className={classes.scrollh}>
      <AliceCarousel
        mouseTracking
        infinite={true}
        autoPlay={true}
        autoPlayInterval={2000}
        animationDuration={2000}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
      />
    </div>
  );
}

export default ScrollHorizontal;
