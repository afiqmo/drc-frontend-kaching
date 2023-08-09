import React, { useState, useEffect } from "react";
import Service from "../service/Service";
import { CryptoState } from "../CryptoContext";
import {
  makeStyles,
  createTheme,
  Container,
  Typography,
  ThemeProvider,
  TextField,
} from "@material-ui/core";
import MockTable from "../components/MockTable";
import SearchIcon from "../asset/search.png";

const useStyle = makeStyles((theme) => ({}));

function CoinTable() {
  const classes = useStyle();

  const { currency, coins } = CryptoState();

  const [search, setSearch] = useState("");

  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <TextField
          label="Search"
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 20, width: "100%" }}
          InputProps={{
            endAdornment: <img src={SearchIcon} height={30} />,
          }}
        />

        <MockTable
          coins={Service.handleSearch(coins, search.toLocaleLowerCase())}
        />
      </Container>
    </ThemeProvider>
  );
}

export default CoinTable;
