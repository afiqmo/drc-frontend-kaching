import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  makeStyles,
  TableHead,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { CryptoState } from "../CryptoContext";
import DeleteModal from "../components/DeleteModal";
import { Doughnut } from "react-chartjs-2";
import HoldingModal from "../components/HoldingModal";
import PortfolioChart from "../components/PortfolioChart";
import Portfolioinfo from "../components/Portfolioinfo";
import Service from "../service/Service";
import { chartDays } from "../service/Service";
import currentAssetIcon from "../asset/currentasseticon.png";
import infoicon from "../asset/infoicon.png";
import { useNavigate } from "react-router-dom";

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
    // boxShadow: "inset -2px 0px 5px rgba(79, 58, 84, 0.52)",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    width: "85% ",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: 20,
      justifyContent: "center",
    },
  },
  selectButton: {
    width: "10%",
    // border: "1px solid #FFE227",
    border: "5px solid #FFFFFF",
    borderRadius: 5,
    padding: 10,
    cursor: "pointer",
    marginLeft: 10,
    alignItems: "center",
    "&:hover": {
      backgroundColor: "#FFE227",
      color: "black",
    },
    [theme.breakpoints.down("sm")]: {
      width: "20%",
      alignItems: "center",
    },
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // width: "90%",
    marginRight: 60,
    paddingLeft: 40,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
      padding: 0,
    },
  },
  red: {
    backgroundColor: "#FF0000",
    marginLeft: 10,
    color: "black",
    padding: 5,
    borderRadius: 5,
    width: "80%",
    display: "flex",
    justifyContent: "center",
  },
  green: {
    backgroundColor: "#33FF00",
    marginLeft: 10,
    color: "black",
    padding: 5,
    borderRadius: 5,
    width: "80%",
    display: "flex",
    justifyContent: "center",
  },
  yellow: {
    backgroundColor: "#FFE227",
    marginLeft: 10,
    color: "black",
    padding: 5,
    borderRadius: 5,
    width: "80%",
    display: "flex",
    justifyContent: "center",
  },
  volatilityContainer: {
    borderRadius: "15px",
    background: "#212121",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
    paddingTop: 0,
    marginTop: 50,
    width: "90%",
    height: "80%",
    [theme.breakpoints.down("sm")]: {
      padding: 30,
      paddingTop: 0,
    },
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "15px",
    background: "#212121",
    padding: "30px",
    marginTop: 50,
    marginBottom: "50px",
    width: "90%",
    [theme.breakpoints.down("sm")]: {
      marginBottom: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));

function PortfolioPage() {
  const { user, setAlert, watchlist, coins, currency, symbol, portfolioVol } =
    CryptoState();

  const [userCoin, setUserCoin] = useState([]);
  const [userCoin2, setUserCoin2] = useState([]);
  const [userCoin3, setUserCoin3] = useState();
  const [period, setPeriod] = useState("price_change_percentage_24h");
  const [days, setDays] = useState(1);
  const [userState, setUserState] = useState(user);
  const [isMobile, setIsMobile] = useState(false);
  const [avgPriceChange, setAvgPriceChange] = useState(0);
  const [currentPortfolioPrice, setCurrentPortfolioPrice] = useState(0);
  const [timeFrame, setTimeFrame] = useState("24H");
  const [donutCoin, setDonutCoin] = useState([]);
  const [volatilityDesc, setVolatilityDesc] = useState("daily");

  const [coinAlert, setCoinAlert] = useState([]);

  const navigate = useNavigate();

  const classes = useStyles();

  const handleResize = () => {
    if (window.innerWidth < 1280) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  useEffect(() => {
    Promise.all(
      coins.map(async (coin) => {
        if (watchlist?.includes(watchlist?.find((e) => e.id === coin.id)))
          return Service.getSingleCoin(coin.id);
      })
    )
      .then((z) => {
        setUserCoin(z.filter((y) => !!y));
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: `API request exceed 50 limit, please wait 1 minute`,
          type: "error",
        });
      });
  }, [watchlist]);

  useEffect(() => {
    userCoin.map((e) => setUserCoin2((userCoin2) => [...userCoin2, e.data]));
  }, [userCoin]);

  useEffect(() => {
    watchlist.map((e) =>
      userCoin2.map((z) => {
        e.id === z.id && (z.holding = e.holding);
      })
    );
    setUserCoin3([...new Map(userCoin2.map((m) => [m.id, m])).values()]);
  }, [userCoin2]);

  useEffect(() => {
    setUserState(user);
  }, [user]);

  useEffect(() => {
    const totalWeight = userCoin3?.reduce((sum, coin) => {
      if (watchlist?.includes(watchlist?.find((e) => e.id === coin?.id))) {
        return (
          sum +
          coin.holding *
            coin?.market_data?.current_price[currency?.toLowerCase()]
        );
      } else {
        return sum + 0;
      }
    }, 0);

    setAvgPriceChange(
      userCoin3?.length > 0 &&
        userCoin3?.reduce((sum, coin) => {
          if (watchlist?.includes(watchlist?.find((e) => e.id === coin?.id))) {
            return (
              sum +
              (coin?.market_data[period] *
                coin?.holding *
                coin?.market_data?.current_price[currency?.toLowerCase()]) /
                totalWeight
            );
          } else {
            return sum + 0;
          }
        }, 0)
    );
  }, [watchlist, userCoin2, userCoin3, period]);

  useEffect(() => {
    setCurrentPortfolioPrice(
      userCoin3?.length > 0 &&
        userCoin3?.reduce((sum, coin) => {
          if (watchlist?.includes(watchlist?.find((e) => e.id === coin?.id))) {
            return (
              sum +
              coin?.market_data?.current_price[currency?.toLowerCase()] *
                coin?.holding
            );
          } else {
            return sum + 0;
          }
        }, 0)
    );
  }, [watchlist, userCoin2, userCoin3, currency]);

  const topPerformCoin =
    userCoin2.length > 0 &&
    userCoin2?.reduce((prev, current) => {
      if (
        watchlist?.includes(
          watchlist?.find((e) => e.id === prev?.id || e.id === current?.id)
        )
      ) {
        return prev?.market_data[period] > current?.market_data[period]
          ? prev
          : current;
      }
    });

  const worstPerformCoin =
    userCoin2.length > 0 &&
    userCoin2?.reduce((prev, current) => {
      if (
        watchlist?.includes(
          watchlist?.find((e) => e.id === prev?.id || e.id === current?.id)
        )
      ) {
        return prev?.market_data[period] < current?.market_data[period]
          ? prev
          : current;
      }
    });

  useEffect(() => {
    userCoin2?.map((e) => {
      if (!coinAlert?.find(({ id }) => id === e.id)) {
        e.market_data.price_change_percentage_24h < -5 &&
          setCoinAlert((coinAlert) => [...coinAlert, e]);
      }
    });
  }, [userCoin2]);

  useEffect(() => {
    const sumArr = userCoin3?.map(
      (e) => e?.holding * e?.market_data?.current_price[currency?.toLowerCase()]
    );
    const sum = sumArr?.reduce((acc, val) => acc + val, 0);
    const holdingArr = userCoin3?.map((e) => {
      return {
        id: e.id,
        name: e.name,
        weight:
          e?.holding * e?.market_data?.current_price[currency?.toLowerCase()],
        total_weight: sum,
      };
    });

    setDonutCoin(holdingArr);
  }, [userCoin, userCoin2, userCoin3, watchlist]);

  const random_rgba = () => {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ",1";
  };
  const colourDoughnut = donutCoin?.map((e) => random_rgba());
  const weightageTooltip = `The weightage of each coin in your portfolio`;

  const timeVol =
    days === 1
      ? portfolioVol / Math.sqrt(1 / 288)
      : days === 30
      ? portfolioVol / Math.sqrt(1 / 72)
      : portfolioVol / Math.sqrt(1 / 365);

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={currentAssetIcon}
            height="30"
            style={{ marginRight: 20 }}
            alt="currentasseticon"
          />
          <div>
            <Typography variant="h3" style={{ fontFamily: "VT323" }}>
              Current Asset
            </Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Typography
            variant="h5"
            style={{ fontFamily: "VT323", marginTop: 25 }}
          >
            Portfolio Price :
          </Typography>
          <Typography
            variant="h4"
            style={{
              fontFamily: "VT323",
              marginTop: 25,
              marginLeft: 15,
            }}
          >
            {symbol}
            {user
              ? currentPortfolioPrice
                ? currentPortfolioPrice?.toFixed(2)
                : "0"
              : "0"}
          </Typography>
        </div>

        {userState ? (
          <>
            <div
              style={{
                marginTop: 20,
                width: "90%",
                backgroundColor: "rgba(79, 58, 84, 0.52)",
              }}
            >
              <Paper
                sx={{
                  width: "100%",
                  overflow: "hidden",
                }}
                style={{
                  borderRadius: "15px",
                }}
              >
                <TableContainer
                  component={Paper}
                  style={{ backgroundColor: "#212121", color: "black" }}
                >
                  <div
                    style={{
                      overflow: "auto",
                      maxHeight: isMobile ? "250px" : "550px",
                    }}
                  >
                    <Table
                      sx={{ minWidth: 650 }}
                      aria-label="simple table"
                      stickyHeader
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              color: "black",
                              backgroundColor: "#FFE227",
                            }}
                          >
                            Coin
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color: "black",
                              backgroundColor: "#FFE227",
                            }}
                          >
                            Holdings
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              color: "black",
                              backgroundColor: "#FFE227",
                            }}
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userCoin3?.map((row) => {
                          if (
                            watchlist.includes(
                              watchlist.find((watch) => watch.id === row.id)
                            )
                          ) {
                            return (
                              <TableRow
                                key={row.name}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell
                                  component="th"
                                  scope="row"
                                  style={{ color: "white" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div style={{ marginRight: 10 }}>
                                      <img
                                        src={row?.image?.thumb}
                                        height="20"
                                        alt="coinicon"
                                      />
                                    </div>
                                    <div>{row.name}</div>
                                  </div>
                                </TableCell>
                                <TableCell
                                  align="right"
                                  style={{ color: "white" }}
                                >
                                  <div>
                                    <div>
                                      {symbol}
                                      {row.holding *
                                        row.market_data.current_price[
                                          currency.toLowerCase()
                                        ] >=
                                      1
                                        ? (
                                            row.holding *
                                            row.market_data.current_price[
                                              currency.toLowerCase()
                                            ]
                                          ).toFixed(2)
                                        : (
                                            row.holding *
                                            row.market_data.current_price[
                                              currency.toLowerCase()
                                            ]
                                          ).toPrecision(4)}
                                    </div>
                                    <div>
                                      {row.holding >= 1
                                        ? row.holding.toFixed(2)
                                        : row?.holding.toPrecision(4)}{" "}
                                      {row.symbol?.toUpperCase()}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell align="right">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                      gap: 20,
                                    }}
                                  >
                                    <HoldingModal coin={row} />

                                    <DeleteModal row={row} />
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TableContainer>
              </Paper>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                margin: 20,
              }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#FFE227",
                  border: "5px solid white",
                  color: "black",
                  fontFamily: "VT323",
                  fontSize: 20,
                }}
                onClick={() => {
                  navigate("/coinList");
                }}
              >
                Add New Coin
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}

        {userState ? (
          <>
            <div className={classes.volatilityContainer}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h3"
                  style={{
                    fontFamily: "VT323",
                    marginTop: 50,
                    marginBottom: 20,
                  }}
                >
                  Volatility
                  <Tooltip title="Volatility is how much and how quickly prices move over a given span of time.">
                    <img
                      src={infoicon}
                      height="13px"
                      style={{ marginBottom: "25px" }}
                    />
                  </Tooltip>
                </Typography>
                <Typography variant="subtitle1" style={{ fontFamily: "VT323" }}>
                  {volatilityDesc} volatility of portfolio/
                  {currency?.toUpperCase()} in the last {days} day(s)
                </Typography>
                <Typography variant="h2" style={{ fontFamily: "VT323" }}>
                  {" "}
                  {timeVol.toFixed(2)}%
                </Typography>

                <div
                  className={
                    timeVol > 35
                      ? classes.red
                      : timeVol > 10
                      ? classes.yellow
                      : classes.green
                  }
                >
                  {" "}
                  <Tooltip
                    title={`Note that the risk level may not reflect to your risk appetite. eg: 36% volatility may not be considered as high for  you`}
                  >
                    <Typography variant="h4" style={{ fontFamily: "VT323" }}>
                      {timeVol > 35
                        ? "high"
                        : timeVol > 10
                        ? "moderate"
                        : "low"}
                    </Typography>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className={classes.chartContainer}>
              <Typography
                variant="h3"
                style={{
                  fontFamily: "VT323",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                Coin Weightage{" "}
                <Tooltip title={weightageTooltip}>
                  <img
                    src={infoicon}
                    height="13"
                    style={{ marginBottom: "25px" }}
                    alt="infoicon"
                  />
                </Tooltip>
              </Typography>
              {donutCoin && (
                <Doughnut
                  data={{
                    labels: donutCoin?.map((e) => {
                      if (
                        watchlist.includes(
                          watchlist.find((watch) => watch.id === e?.id)
                        )
                      ) {
                        return e.name;
                      } else {
                        return "deleted";
                      }
                    }),
                    datasets: [
                      {
                        data: donutCoin
                          ? donutCoin?.map(
                              (e) => (e.weight / e.total_weight) * 100
                            )
                          : [],
                        borderWidth: 0,
                        backgroundColor: colourDoughnut,
                        radius: "60%",
                      },
                    ],
                  }}
                  option={{
                    animation: { animateRotate: false },
                  }}
                />
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <div className={classes.mainbar}>
        {!userState ? (
          <>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "800px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {" "}
              Please Login{" "}
            </div>
          </>
        ) : userCoin2.length === 0 ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "800px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            Your portfolio is empty. Please add coins to start monitoring.
          </div>
        ) : (
          <div style={{ width: "100%", paddingTop: 40 }}>
            <div className={classes.titleContainer}>
              <Typography variant="h2" style={{ fontFamily: "VT323" }}>
                Portfolio
              </Typography>
              <div className={classes.buttonContainer}>
                {chartDays.map((e) => {
                  if (e?.value !== 90) {
                    return (
                      <div
                        key={e.value}
                        onClick={() => {
                          setDays(e.value);
                          setPeriod(e.api_period);
                          setTimeFrame(e.label);
                          setVolatilityDesc(e.vol);
                        }}
                        className={classes.selectButton}
                        style={{
                          backgroundColor: e.value === days ? "#FFE227" : "",
                          color: e.value === days ? "black" : "",
                        }}
                      >
                        {e.label}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <Portfolioinfo
              avgPriceChange={avgPriceChange}
              topPerformCoin={topPerformCoin}
              Worst={worstPerformCoin}
              alert={coinAlert}
              period={period}
              timeFrame={timeFrame}
            />
            <PortfolioChart
              days={days}
              volatilityDesc={volatilityDesc}
              timeFrame={timeFrame}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
