import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";
import infoicon from "../asset/infoicon.png";

const useStyle = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
    marginBottom: 50,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      padding: "0",
    },
  },
  secondContainer: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      width: "90%",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  titleContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      marginBottom: 0,
    },
  },
  selectChart: {
    padding: 10,
    backgroundColor: "rgba(79, 58, 84, 0.52)",
    borderRadius: 5,
    [theme.breakpoints.down("md")]: {
      margin: 20,
    },
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      marginTop: 10,
      marginBottom: 10,
    },
  },
}));

function PortfolioChart({ days, volatilityDesc, timeFrame }) {
  const classes = useStyle();

  const { setAlert, watchlist, coins, currency, setPortfolioVol, symbol } =
    CryptoState();

  const [coinHistData, setCoinHistData] = useState([]);
  const [coinHistData2, setCoinHistData2] = useState([]);
  const [isChart, setIsChart] = useState("portfolio");
  const [coinChart, setCoinChart] = useState([]);

  useEffect(() => {
    Promise.all(
      coins.map(async (coin) => {
        if (watchlist.includes(watchlist.find((e) => e.id === coin.id)))
          return Service.getHistoricalChart(coin.id, days, currency)
            .then(async (z) => {
              setCoinHistData((coinHistData) => [
                ...coinHistData,
                { coin, hist_data: z.data.prices },
              ]);
            })
            .catch((err) => {
              setAlert({
                open: true,
                message: `API request exceed 50 limit, please wait 1 minute`,
                type: "error",
              });
            });
      })
    );
  }, [watchlist, days, currency]);

  useEffect(() => {
    setCoinHistData2([
      ...new Map(coinHistData.map((m) => [m.coin.id, m])).values(),
    ]);
  }, [coinHistData, watchlist]);

  useEffect(() => {
    watchlist.map((e) =>
      coinHistData2.map((z) => {
        e.id === z.coin.id && (z.coin.holding = e.holding);
      })
    );
  }, [coinHistData2, watchlist]);

  const coinsd = coinHistData2?.map((e) => {
    const priceData = e.hist_data?.map((chartData) => chartData[1]);

    const dateData = e.hist_data?.map((chartData) => chartData[0]);

    const priceReturn = priceData
      .map((v, i, a) => Math.log(v / (i ? a[i - 1] : 0)))
      .slice(1);

    return {
      ...e,
      hist_return_data: { 0: dateData.slice(1), 1: priceReturn },
      price_return: priceReturn,
      price_data: priceData,
    };
  });

  const coinsd2 = coinsd?.map((e) => {
    const totalWeight = coinsd?.reduce(
      (sum, coin) => sum + coin?.coin?.holding * coin?.coin?.current_price,
      0
    );
    const sdReturn = (arr = e.price_return) => {
      const sum = arr.reduce((acc, val) => acc + val);
      const { length: num } = arr;
      const median = sum / num;
      const sumx = arr.reduce((acc, val) => acc + val - median);
      let variance = 0;
      arr.forEach((num) => {
        variance += (num - median) * (num - median);
      });
      variance /= num;
      return {
        sum: ((e?.coin?.holding * e.coin?.current_price) / totalWeight) * sumx,
        sd_return:
          ((e?.coin?.holding * e.coin?.current_price) / totalWeight) *
          ((e?.coin?.holding * e.coin?.current_price) / totalWeight) *
          variance,
      };
    };

    const sdPrice = (arr = e.price_data) => {
      const sum = arr.reduce((acc, val) => acc + val);
      const { length: num } = arr;
      const median = sum / num;
      const sumx = arr.reduce((acc, val) => acc + val - median);
      let variance = 0;
      arr.forEach((num) => {
        variance += (num - median) * (num - median);
      });
      variance /= num;
      return {
        sum: ((e?.coin?.holding * e.coin?.current_price) / totalWeight) * sumx,
        sd_price:
          ((e?.coin?.holding * e.coin?.current_price) / totalWeight) *
          ((e?.coin?.holding * e.coin?.current_price) / totalWeight) *
          variance,
      };
    };

    return {
      ...e,
      stats_return: sdReturn(),
      stats_price: sdPrice(),
      total_weight: totalWeight,
    };
  });

  const portfolioPriceChart = () => {
    const dateData = coinsd2[0]?.hist_data.map((e) => e[0]);

    const arrPrice = coinsd2?.map((e) =>
      e?.hist_data.map((v) => v[1] * e.coin.holding)
    );

    const avgPrice = (...arrays) => {
      const n = arrays.reduce((max, xs) => Math.min(max, xs.length), 1000);
      const result = Array.from({ length: n });
      return result.map((_, i) =>
        arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0)
      );
    };

    return { time: dateData, avg_return: avgPrice(...arrPrice) };
  };

  const portfolioReturnChart = () => {
    const totalWeight = coinsd?.reduce(
      (sum, coin) => sum + coin?.coin?.holding * coin?.coin?.current_price,
      0
    );
    const dateData = coinsd2[0]?.hist_return_data[0];

    const arrReturn = coinsd2.map((e) =>
      e?.hist_return_data[1].map(
        (v) => (v * e?.coin?.holding * e?.coin?.current_price) / totalWeight
      )
    );

    const avgReturn = (...arrays) => {
      const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
      const result = Array.from({ length: n });
      return result.map((_, i) =>
        arrays.map((xs) => xs[i] || 0).reduce((sum, x) => sum + x, 0)
      );
    };

    return { time: dateData, avg_return: avgReturn(...arrReturn) };
  };

  useEffect(() => {
    const portfolioVolatility = () => {
      const pricestat = coinsd2?.map((e) => e.stats_price);
      const returnstat = coinsd2?.map((e) => e.stats_return);

      const n_denomenator = coinsd2[0]?.price_data?.length;

      const price_sum_var =
        pricestat &&
        pricestat
          .map((stat) => stat.sd_price)
          ?.reduce((acc, val) => acc + val, 0);

      const return_sum_var =
        returnstat &&
        returnstat
          .map((stat) => stat.sd_return)
          ?.reduce((acc, val) => acc + val, 0);

      const price_sum_cov =
        pricestat &&
        pricestat
          .map((v, i, a) =>
            a
              .filter((_, _i) => _i !== i)
              .reduce((p, c) => p + (v.sum * c.sum) / n_denomenator, 0)
          )
          .reduce((p, v) => p + v, 0);

      const return_sum_cov =
        returnstat &&
        returnstat
          .map((v, i, a) =>
            a
              .filter((_, _i) => _i !== i)
              .reduce((p, c) => p + (v.sum * c.sum) / n_denomenator, 0)
          )
          .reduce((p, v) => p + v, 0);

      return {
        price_sd: Math.sqrt(price_sum_cov + price_sum_var),
        return_sd: Math.sqrt(return_sum_cov + return_sum_var) * 100,
      };
    };

    setPortfolioVol(portfolioVolatility()?.return_sd);
  }, [watchlist, coinsd2, days, setPortfolioVol]);

  useEffect(() => {
    setCoinChart(
      coinHistData2.map((e) => {
        const data1 = e.hist_data?.map((chartData) => chartData[1]);

        const ratio = Math.max(...data1) - Math.min(...data1);

        const min = Math.min(...data1);

        const data2 = data1.map((v) => (v - min) / ratio);

        const random_rgba = () => {
          var o = Math.round,
            r = Math.random,
            s = 255;
          return (
            "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ",1"
          );
        };

        if (
          watchlist.includes(
            watchlist.find((watch) => watch.id === e?.coin?.id)
          )
        ) {
          return {
            data: data2,
            label: ` ${e.coin.id}`,
            borderColor: random_rgba(),
            borderWidth: 2,
            pointBorderColor: "rgba(0,0,0,0)",
            pointBackgroundColor: "rgba(0,0,0,0)",
            pointHoverBorderColor: "#5AC53B",
            pointHitRadius: 6,
            yAxisID: "y",
          };
        } else {
          return {
            data: [],
            label: ``,
            borderColor: "rgba(0,0,0,0.0)",
            borderWidth: 2,
            pointBorderColor: "rgba(0,0,0,0)",
            pointBackgroundColor: "rgba(0,0,0,0)",
            pointHoverBorderColor: "#5AC53B",
            pointHitRadius: 6,
            yAxisID: "y",
          };
        }
      })
    );
  }, [coinHistData2]);

  const totalDuration = 2500;
  const delayBetweenPoints = totalDuration / 250;

  const animation = {
    x: {
      easing: "linear",
      duration: delayBetweenPoints,
      from: NaN,
      delay(ctx) {
        if (ctx.type !== "data" || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  };

  const random_rgba = () => {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ",1";
  };

  const histPriceTooltip = `The price of your portfolio for the past ${days} day(s)`;
  const relPriceTooltip = `The price of each coin in your portfolio relative to its highest value for the past ${days} day(s).`;
  const histReturnTooltip = `The Historical Returns of your portfolio for the past ${days} day(s).`;

  return (
    <div className={classes.container}>
      <div className={classes.secondContainer}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: "15px",
            padding: 20,
          }}
        >
          {" "}
          <div className={classes.titleContainer}>
            <>
              {isChart === "portfolio" ? (
                <Typography variant="h3" style={{ fontFamily: "VT323" }}>
                  Historical Portfolio Value{" "}
                  <Tooltip title={histPriceTooltip}>
                    <img
                      src={infoicon}
                      height="13"
                      style={{ marginBottom: "25px" }}
                    />
                  </Tooltip>
                </Typography>
              ) : isChart === "coin" ? (
                <Typography variant="h3" style={{ fontFamily: "VT323" }}>
                  Coin Price {""}
                  <Tooltip title={relPriceTooltip}>
                    <img
                      src={infoicon}
                      height="13px"
                      style={{ marginBottom: "25px" }}
                    />
                  </Tooltip>
                </Typography>
              ) : (
                <Typography variant="h3" style={{ fontFamily: "VT323" }}>
                  Historical Returns{" "}
                  <Tooltip title={histReturnTooltip}>
                    <img
                      src={infoicon}
                      height="13"
                      style={{ marginBottom: "25px" }}
                    />
                  </Tooltip>
                </Typography>
              )}
            </>
            <div className={classes.selectChart}>
              <Button
                style={{
                  backgroundColor:
                    isChart === "portfolio" ? "#FFE227" : "transparent",
                  color: isChart === "portfolio" ? "black" : "white",
                  border:
                    isChart === "portfolio"
                      ? "5px solid #FFFFFF"
                      : "transparent",
                }}
                onClick={() => {
                  setIsChart("portfolio");
                }}
              >
                Portfolio
              </Button>
              <Button
                style={{
                  backgroundColor:
                    isChart === "coin" ? "#FFE227" : "transparent",
                  color: isChart === "coin" ? "black" : "white",
                  border:
                    isChart === "coin" ? "5px solid #FFFFFF" : "transparent",
                }}
                onClick={() => {
                  setIsChart("coin");
                }}
              >
                Coin
              </Button>
              <Button
                style={{
                  backgroundColor:
                    isChart === "return" ? "#FFE227" : "transparent",
                  color: isChart === "return" ? "black" : "white",
                  border:
                    isChart === "return" ? "5px solid #FFFFFF" : "transparent",
                }}
                onClick={() => {
                  setIsChart("return");
                }}
              >
                Return
              </Button>
            </div>
          </div>
          {isChart === "portfolio" ? (
            portfolioPriceChart().avg_return.length === 0 ? null : (
              <Line
                data={{
                  labels: portfolioPriceChart()?.time?.map((e) => {
                    let date = new Date(e);
                    let time = `${date.getHours()}:${date.getMinutes()} `;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: portfolioPriceChart()?.avg_return.map((e) => e),
                      label: `Portfolio Price`,
                      borderColor: "yellow",
                      borderWidth: 2,
                      pointBorderColor: "rgba(0,0,0,0)",
                      pointBackgroundColor: "rgba(0,0,0,0)",
                      pointHoverBorderColor: "#5AC53B",
                      pointHitRadius: 6,
                      yAxisID: "y",
                    },
                  ],
                }}
                options={{
                  animation,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: { y: { display: true } },
                }}
              />
            )
          ) : isChart === "coin" ? (
            <Line
              data={{
                labels: coinHistData2[0]?.hist_data?.map((chartData) => {
                  let date = new Date(chartData[0]);
                  let time = `${date.getHours()}:${date.getMinutes()} `;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: coinChart,
              }}
              options={{
                animation,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                scales: { y: { display: true } },
              }}
            />
          ) : (
            portfolioReturnChart() && (
              <Line
                data={{
                  labels: portfolioReturnChart()?.time?.map((e) => {
                    let date = new Date(e);
                    let time = `${date.getHours()}:${date.getMinutes()} `;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: portfolioReturnChart()?.avg_return.map(
                        (e) => e * 100
                      ),
                      label: `Return %`,
                      borderColor: "rgba(255, 226, 39, 1)",
                      borderWidth: 0.5,
                      pointBorderColor: "rgba(0,0,0,0)",
                      pointBackgroundColor: "rgba(0,0,0,0)",
                      pointHoverBorderColor: "#5AC53B",
                      pointHitRadius: 6,
                      yAxisID: "y",
                      fill: true,
                      backgroundColor: "rgba(255, 226, 39, 0.6)",
                    },
                  ],
                }}
                options={{
                  animation: { duration: 3000, easing: "easeInOutCubic" },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: { y: { display: true } },
                }}
              />
            )
          )}
        </div>
      </div>
      <div className={classes.secondContainer} style={{ marginTop: 40 }}>
        <TableContainer
          component={Paper}
          style={{ backgroundColor: "rgba(79, 58, 84, 0.52)", color: "black" }}
        >
          {" "}
          <div
            style={{
              overflow: "auto",
              maxHeight: "375px",
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
                    style={{ color: "black", backgroundColor: "#FFE227" }}
                  >
                    Coin
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "black", backgroundColor: "#FFE227" }}
                  >
                    &sigma; of price ({volatilityDesc})
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "black", backgroundColor: "#FFE227" }}
                  >
                    &sigma; of return ({volatilityDesc})
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {coinsd2 &&
                  coinsd2?.map((row) => {
                    if (
                      watchlist.includes(
                        watchlist.find((watch) => watch.id === row.coin.id)
                      )
                    ) {
                      const priceVol = Math.sqrt(
                        row.stats_price.sd_price /
                          ((row.coin.holding * row.coin.current_price) /
                            row.total_weight) **
                            2
                      );
                      const returnVol1 =
                        Math.sqrt(
                          row.stats_return.sd_return /
                            ((row.coin.holding * row.coin.current_price) /
                              row.total_weight) **
                              2
                        ) * 100;

                      const returnVol2 =
                        days === 1
                          ? returnVol1 / Math.sqrt(1 / 288)
                          : days === 30
                          ? returnVol1 / Math.sqrt(1 / 72)
                          : returnVol1 / Math.sqrt(1 / 365);

                      return (
                        <TableRow
                          key={row.coin.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
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
                                <img src={row?.coin.image} height="20" />
                              </div>
                              <div>{row.coin.name}</div>
                            </div>
                          </TableCell>
                          <TableCell align="right" style={{ color: "white" }}>
                            {symbol}
                            {priceVol.toPrecision(4)} {currency?.toUpperCase()}
                          </TableCell>
                          <TableCell align="right" style={{ color: "white" }}>
                            {returnVol2.toPrecision(4)}%
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
              </TableBody>
            </Table>
          </div>
        </TableContainer>
      </div>
    </div>
  );
}

export default PortfolioChart;
