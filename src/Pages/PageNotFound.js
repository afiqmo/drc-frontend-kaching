import { Typography } from "@mui/material";
import React from "react";
import ChromeDinoGame from "react-chrome-dino";

function PageNotFound() {
  console.log(
    "Hye Investor~, you have found me, so, tell me, what is the meaning of life?"
  );
  return (
    <>
      <ChromeDinoGame />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 40,
        }}
      >
        <Typography variant="h1" style={{ fontFamily: "VT323" }}>
          {" "}
          Error: Page Not Found{" "}
        </Typography>
        <Typography variant="h5" style={{ fontFamily: "VT323" }}>
          {" "}
          but you found a lost little dino
        </Typography>

        <Typography
          variant="h6"
          style={{ fontFamily: "VT323", color: "rgba(1,1,1,0.1)" }}
        >
          {" "}
          but have you discover the hidden button?
        </Typography>
      </div>
    </>
  );
}

export default PageNotFound;
