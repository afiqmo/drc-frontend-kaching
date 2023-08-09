import { Container, Tooltip, Typography, makeStyles } from "@material-ui/core";
import { Pin, Rule } from "@mui/icons-material";

import { Doughnut } from "react-chartjs-2";
import React from "react";
import { color } from "@mui/system";
import { hover } from "@testing-library/user-event/dist/hover";
import infoicon from "../asset/infoicon.png";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 40,
    width: "90%",
    [theme.breakpoints.down(1700)]: {
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      marginTop: 0,
    },
  },
  chartbox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    padding: 20,
    width: "90%",
    margin: 60,
    borderRadius: "15px",
    background: "rgba(79, 58, 84, 0.52)",
    minHeight: "185px",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      display: "flex",
      width: "90%",
      marginTop: 40,
      alignItems: "center",
      justifyContent: "space-evenly",
    },
  },
}));

function CoinStats({ coin }) {
  const classes = useStyles();

  return (
    <div className={classes.chartbox}>
      <div className={classes.container}>
        <Container
          data-aos="flip-down"
          data-aos-duration="1500"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {" "}
          <div
            style={{
              width: "88%",
              display: "flex",
              justifyContent: "flex-end",
              opacity: "0.8",
            }}
          >
            <Tooltip
              title="The activeness of coin in different platforms such as the amount of Reddit active accounts, Telegram users and Twitter followers."
              enterTouchDelay={0}
            >
              <img src={infoicon} height="13" />
            </Tooltip>
          </div>
          <Typography variant="h4" style={{ fontFamily: "VT323" }}>
            Community Score{" "}
          </Typography>
          <Typography variant="h4" style={{ fontFamily: "VT323" }}>
            {coin?.community_score.toFixed(2)}%
          </Typography>
          <Doughnut
            data={{
              labels: ["Community Score"],
              datasets: [
                {
                  data: [
                    `${coin?.community_score}`,
                    `${100 - coin?.community_score}`,
                  ],
                  backgroundColor: ["#FFE227", "rgba(90,29,117, 0.5)"],
                  borderWidth: 0,
                  radius: "60%",
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              responsive: true,
            }}
          />
        </Container>
        <Container
          data-aos="flip-down"
          data-aos-duration="1500"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "88%",
              display: "flex",
              justifyContent: "flex-end",
              opacity: "0.8",
            }}
          >
            <Tooltip
              title="The measurement of developer's contribution activity on coin. "
              enterTouchDelay={0}
            >
              <img src={infoicon} height="13" />
            </Tooltip>
          </div>
          <Typography variant="h4" style={{ fontFamily: "VT323" }}>
            Developer Score{" "}
          </Typography>

          <Typography variant="h4" style={{ fontFamily: "VT323" }}>
            {coin?.developer_score.toFixed(2)}%
          </Typography>
          <Doughnut
            data={{
              labels: ["Developer Score"],
              datasets: [
                {
                  data: [
                    `${coin?.developer_score}`,
                    `${100 - coin?.developer_score}`,
                  ],
                  backgroundColor: ["#FFE227", "rgba(90,29,117, 0.5)"],
                  borderWidth: 0,
                  radius: "60%",
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              responsive: true,
            }}
          />
        </Container>
        <Container
          data-aos="flip-down"
          data-aos-duration="1500"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "88%",
              display: "flex",
              justifyContent: "flex-end",
              opacity: "0.8",
            }}
          >
            <Tooltip
              title="The ease of the coin to be converted into cash without impacting the price and vice versa."
              enterTouchDelay={0}
            >
              <img src={infoicon} height="13" />
            </Tooltip>
          </div>
          <Typography variant="h4" style={{ fontFamily: "VT323" }}>
            Liquidity Score{" "}
          </Typography>

          <Typography variant="h4" style={{ fontFamily: "VT323" }}>
            {coin?.liquidity_score.toFixed(2)}%
          </Typography>
          <Doughnut
            data={{
              labels: ["Liquidity Score"],
              datasets: [
                {
                  data: [
                    `${coin?.liquidity_score}`,
                    `${100 - coin?.liquidity_score}`,
                  ],
                  backgroundColor: ["#FFE227", "rgba(90,29,117, 0.5)"],
                  borderWidth: 0,
                  radius: "60%",
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              responsive: true,
            }}
          />
        </Container>
      </div>
    </div>
  );
}

export default CoinStats;
