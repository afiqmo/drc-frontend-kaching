import { Typography } from "@material-ui/core";
import React from "react";
import CoinTable from "../components/CoinTable";
import Trending2 from "../components/Trending2";

function CoinListPage() {
  console.log(
    "you might find the answer in Douglas Adams’s 1979 novel,The Hitchhiker’s Guide to the Galaxy"
  );
  return (
    <div>
      <Trending2 />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 40,
          marginTop: 40,
        }}
      >
        <Typography
          variant="h3"
          style={{ fontFamily: "VT323", paddingLeft: 20, paddingRight: 20 }}
        >
          Search your favourite coin
        </Typography>
      </div>
      <CoinTable />
    </div>
  );
}

export default CoinListPage;
