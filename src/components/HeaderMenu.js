import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "../asset/menu.png";
import { createTheme, ThemeProvider } from "@material-ui/core";

import { CryptoState } from "../CryptoContext";
import { useNavigate } from "react-router-dom";

export default function HeaderMenu({ selectMenu, isMobile }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const { user, setOpen } = CryptoState();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const darkTheme = createTheme({
    palette: {
      primary: { main: "rgba(255,255,255,1)" },
      type: "light",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img src={MenuIcon} alt="menu icon" height={40} />
      </Button>
      <Menu
        // className={classes.menu}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            user ? navigate("/portfolio") : setOpen(true);
            handleClose();
          }}
        >
          Portfolio
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/coinList");
            handleClose();
          }}
        >
          Coin
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/news");
            handleClose();
          }}
        >
          News
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/trade");
            handleClose();
          }}
        >
          Trade
        </MenuItem>

        <MenuItem onClick={handleClose}>{selectMenu}</MenuItem>
      </Menu>
    </ThemeProvider>
  );
}
