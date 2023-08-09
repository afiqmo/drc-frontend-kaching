import { Button, Card, Paper, Tooltip, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";

import CoinChart from "../components/CoinChart";
import CoinConverter from "../components/CoinConverter";
import CoinDesc from "../components/CoinDesc";
import CoinStats from "../components/CoinStats";
import { CryptoState } from "../CryptoContext";
import { LinearProgress } from "@material-ui/core";
import Service from "../service/Service";
import { Typography } from "@material-ui/core";
import announcementIcon from "../asset/announcement.png";
import { db } from "../firebase";
import favouriteIcon from "../asset/favourite.png";
import githubIcon from "../asset/github.png";
import redditIcon from "../asset/reddit.png";
import unfavouriteIcon from "../asset/unfav-icon.png";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  mainbar: {
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginBottom: 0,
      paddingBottom: 40,
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 100,
    marginBottom: -100,
    whiteSpace: "wrap",
    background: "rgba(79, 58, 84, 0.52)",
  },
  description: {
    paddingBottom: 25,
    textAlign: "justify",
  },
  circulatingDescription: {
    paddingBottom: 25,
    textAlign: "center",
  },
  coinBasicContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "center",
    },
  },
  coinBasic: {
    display: "flex",
    alignItems: "center",
  },
  scoreContainerRed: {
    display: "flex",
    margin: 20,
    backgroundColor: "red",
    color: "black",
  },
  scoreContainerGreen: {
    display: "flex",
    margin: 20,
    backgroundColor: "#3EFF47",
    color: "black",
  },
  rankFav: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
}));

function CoinPage() {
  const classes = useStyles();
  const navigate = useNavigate();

  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [loading, setLoading] = useState(false);

  const { currency, symbol, user, watchlist, setAlert, setOpen } =
    CryptoState();

  const handleOpen = () => setOpen(true);

  const getSingleCoin = (e) => {
    setLoading(true);

    Service.getSingleCoin(e)
      .then((response) => {
        setCoin(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: `API request exceed 50 limit, please wait 1 minute`,
          type: "error",
        });
        navigate(`*`);
      });
  };

  useEffect(
    () => {
      setLoading(true);
      getSingleCoin(id);
    },
    [id],
    [currency]
  );

  if (!coin) {
    return (
      <div style={{ minHeight: "600px" }}>
        <LinearProgress />
      </div>
    );
  }

  const inWatchlist = watchlist.includes(
    watchlist.find((e) => e.id === coin?.id)
  );

  const addToWatchList = async () => {
    const coinRef = await doc(db, "watchlist", user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist
          ? [...watchlist, { id: coin.id, holding: 1 }]
          : [{ id: coin.id, holding: 1 }],
      });

      setAlert({
        open: true,
        message: `${coin.name} Added to your portfolio`,
        type: "success",
      });
    } catch (error) {}
  };

  const removeFromWatchlist = async () => {
    const coinRef = await doc(db, "watchlist", user.uid);

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
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 25 }}
        >
          <img src={coin?.image.large} alt={coin?.name} height="90" />
          <div style={{ marginLeft: 20 }}>
            <Typography style={{ fontFamily: "VT323" }} variant="h3">
              {coin?.symbol.toUpperCase()}
            </Typography>
            <Typography style={{ fontFamily: "VT323" }} variant="h4">
              {coin?.name}
            </Typography>
          </div>
          <div className={classes.rankFav}>
            <Card
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 30,
                width: 70,
                margin: 20,
                backgroundColor: "#FFE227",
              }}
            >
              <Typography
                variant="h5"
                style={{ padding: 0, color: "black", fontFamily: "VT323" }}
              >
                #{coin?.market_cap_rank}
              </Typography>
            </Card>
            {coin?.market_cap_rank < 250 ? (
              user ? (
                inWatchlist ? (
                  <Tooltip title="Remove from portfolio">
                    <img
                      src={favouriteIcon}
                      height="25rem"
                      onClick={
                        inWatchlist ? removeFromWatchlist : addToWatchList
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Add to portfolio">
                    <img
                      src={unfavouriteIcon}
                      height="25rem"
                      onClick={
                        inWatchlist ? removeFromWatchlist : addToWatchList
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </Tooltip>
                )
              ) : (
                <img
                  src={unfavouriteIcon}
                  height="30rem"
                  onClick={handleOpen}
                  style={{ cursor: "pointer" }}
                />
              )
            ) : (
              ""
            )}
          </div>
        </div>

        <div className={classes.coinBasicContainer}>
          <span className={classes.coinBasic}>
            <Typography variant="h6" className={classes.description}>
              Market Cap: {symbol}
              {coin?.market_data.market_cap[currency.toLowerCase()]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                .slice(0, -8)}
              {" Million "}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h6" className={classes.circulatingDescription}>
              Circulating Supply:{" "}
              {coin?.market_data?.circulating_supply
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                .slice(0, -8)}
              {" Million "}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h6" className={classes.description}>
              Total Supply:{" "}
              {coin?.market_data.total_supply
                ? coin?.market_data.total_supply
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    .slice(0, -8)
                : "-"}
              {coin?.market_data.total_supply && " Million "}
            </Typography>
          </span>
          <span className={classes.coinBasic}>
            <Typography variant="h6" className={classes.description}>
              Max Supply:{" "}
              {coin?.market_data.max_supply
                ? coin?.market_data.max_supply.toString().slice(0, -6)
                : "-"}
              {coin?.market_data.max_supply && " Million "}
            </Typography>
          </span>
          <Button
            variant="outlined"
            style={{
              backgroundColor: "#FFE227",
              border: "5px solid #FFFFFF",
              color: "black",
              width: "90%",
              height: 40,
              marginBottom: 20,
              marginTop: 20,
            }}
          >
            <a
              href={coin?.links?.homepage[0]}
              style={{ color: "black", fontFamily: "VT323", fontSize: 20 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </a>
          </Button>

          <div style={{ width: "90%", display: "flex" }}>
            {coin?.links?.repos_url?.github[0] && (
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#5F5F5F",
                  border: "5px solid #FFFFFF",
                  width: "90%",
                  height: 40,
                  margin: 5,
                }}
              >
                <a
                  href={coin?.links?.repos_url?.github[0]}
                  style={{ display: "flex" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={githubIcon} alt="github icon" height={20} />
                </a>
              </Button>
            )}

            {coin?.links?.subreddit_url && (
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#FF5733",
                  border: "5px solid #FFFFFF",
                  color: "black",
                  width: "90%",
                  height: 40,
                  margin: 5,
                }}
              >
                <a
                  href={coin?.links?.subreddit_url}
                  style={{ display: "flex" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={redditIcon} alt="reddit icon" height={20} />
                </a>
              </Button>
            )}

            {coin?.links?.announcement_url[0] && (
              <Button
                variant="outlined"
                style={{
                  backgroundColor: "#626FC2",
                  border: "5px solid #FFFFFF",
                  color: "black",
                  width: "90%",
                  height: 40,
                  margin: 5,
                }}
              >
                <a
                  href={coin?.links?.announcement_url[0]}
                  style={{ display: "flex" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={announcementIcon}
                    alt="announcement icon"
                    height={20}
                  />
                </a>
              </Button>
            )}
          </div>
          <div style={{ marginTop: 70, width: "100%" }}>
            <CoinConverter coin={coin} />
          </div>
        </div>
      </div>
      <div className={classes.mainbar}>
        <CoinChart coin={coin} />
        <CoinDesc coin={coin} />
        <CoinStats coin={coin} />
      </div>
    </div>
  );
}

export default CoinPage;
