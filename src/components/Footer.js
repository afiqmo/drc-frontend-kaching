import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Link,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";
import { Security, Info } from "@material-ui/icons";
import footerpixel from "../asset/pixelated_footer.png";

function Footer() {
  const darkTheme = createTheme({
    palette: {
      primary: { main: "#fff" },
      type: "dark",
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <img
        src={footerpixel}
        style={{
          position: "relative",
          width: "100%",
          bottom: "-10px",
        }}
      ></img>
      <AppBar
        position="sticky"
        elevation={0}
        component="footer"
        color="default"
      >
        <Toolbar
          style={{ justifyContent: "center", backgroundColor: "#6B0D74" }}
        >
          <Typography variant="caption">
            ©2022 Ka-Ching! All rights reserved.
          </Typography>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default Footer;
