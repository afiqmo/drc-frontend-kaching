import {
  createTheme,
  TextField,
  ThemeProvider,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { CryptoState } from "../CryptoContext";
import converter from "../asset/converter.png";
import logo from "../asset/currency_1.png";

const useStyles = makeStyles((theme) => ({
  Converterbox: {
    // boxShadow: "inset 5px 5px 5px rgba(79, 58, 84, 0.52)",
    // border: "1px solid white",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    padding: 20,
    width: "75%",
    margin: 15,
    borderRadius: "15px",
    background: "#212121",
    minHeight: "185px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  bigbox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 20,
    width: "100%",
    borderRadius: "15px",
    background: "#212121",
    minHeight: "185px",
    [theme.breakpoints.down("md")]: {
      width: "90%",
      alignItems: "center",
      marginLeft: "5%",
      padding: 10,
    },
  },
  coinbox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "120%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: { main: "#fff" },
    type: "dark",
  },
});

function CoinConverter({ coin }) {
  const [fiat, setFiat] = useState("");
  const [crypto, setCrypto] = useState("");

  const { symbol, currency } = CryptoState();
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.bigbox}>
        <Typography
          style={{ color: "white", fontFamily: "VT323", fontSize: 40 }}
        >
          Crypto Calculator
        </Typography>
        <div className={classes.coinbox}>
          <div className={classes.Converterbox}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={coin?.image?.small}
                height={40}
                style={{ marginRight: 10 }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography style={{ fontSize: 20 }}>
                  {coin?.symbol?.toUpperCase()}
                </Typography>
                <Typography style={{ fontSize: 15 }}> {coin?.name}</Typography>
              </div>
            </div>
            <TextField
              type="number"
              variant="outlined"
              label="insert crypto amount"
              value={crypto}
              onChange={(e) => {
                setCrypto(e.target.value);
                setFiat(
                  e.target.value *
                    coin?.market_data?.current_price[currency?.toLowerCase()]
                );
              }}
              fullWidth
            />
          </div>

          <div>
            <img src={converter} height={50} />
          </div>
          <div className={classes.Converterbox}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={logo} height={40} style={{ marginRight: 10 }} />
              <Typography style={{ fontSize: 20 }}>{currency} </Typography>
              <Typography style={{ fontSize: 20 }}>({symbol}) </Typography>
            </div>

            <TextField
              type="number"
              variant="outlined"
              label="insert currency amount"
              value={fiat}
              onChange={(e) => {
                setFiat(e.target.value);
                setCrypto(
                  e.target.value /
                    coin?.market_data?.current_price[currency?.toLowerCase()]
                );
              }}
              fullWidth
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default CoinConverter;
