import { makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import AliceCarousel from "react-alice-carousel";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  priceh: {
    height: "35px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFE227",
    color: "black",
    position: "sticky",
    top: "70px",
    zIndex: 100,
    [theme.breakpoints.down(800)]: {
      top: "63px",
    },
    [theme.breakpoints.down("xs")]: {
      top: "55px",
    },
  },
  scrollElement: {
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
  },
  red: {
    color: "#FF4B25",
  },
  green: {
    color: "#15981B",
  },
}));

function PriceHorizontal() {
  const classes = useStyle();
  const navigate = useNavigate();

  const { currency, setAlert } = CryptoState();

  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTrendingCoins = (e) => {
    setLoading(true);

    Service.getTrendingCoins(e)
      .then((response) => {
        setTrending(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: `API request exceed 50 limit, please wait 1 minute`,
          type: "error",
        });
      });
  };

  useEffect(() => {
    setLoading(true);
    getTrendingCoins(currency);
  }, [currency]);

  if (loading) {
    return (
      <div>
        <LinearProgress />
      </div>
    );
  }

  const responsive = {
    0: { items: 2 },
    512: { items: 3 },
    624: { items: 4 },
    1024: { items: 6 },
  };

  const items = trending.map((coin) => {
    return (
      <div
        className={classes.scrollElement}
        onClick={() => navigate(`/coins/${coin.id}`)}
      >
        <img
          src={coin.image}
          height="20"
          style={{ marginRight: "10px" }}
          alt="coin icon"
        />

        <div>{coin?.symbol.toUpperCase()} &thinsp; </div>
        <div
          className={
            coin?.price_change_percentage_24h > 0 ? classes.green : classes.red
          }
        >
          {Service.isProfit(coin?.price_change_percentage_24h) ? "+" : ""}
          {parseFloat(coin?.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>
    );
  });
  return (
    <div className={classes.priceh}>
      <AliceCarousel
        mouseTracking
        infinite={true}
        autoPlay={true}
        autoPlayInterval={0}
        animationDuration={10000}
        disableDotsControls
        disableButtonsControls={true}
        responsive={responsive}
        items={items}
      />
    </div>
  );
}

export default PriceHorizontal;
