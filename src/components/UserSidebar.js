import * as React from "react";

import { Typography, makeStyles } from "@material-ui/core";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

import { Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import { CryptoState } from "../CryptoContext";
import Drawer from "@mui/material/Drawer";
import { signOut } from "firebase/auth";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#212121",
    [theme.breakpoints.down("sm")]: {
      width: 300,
    },
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },

  watchlist: {
    flex: 1,
    width: "100%",
    padding: 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    fontFamily: "VT323",
    fontSize: 25,
    color: "white",
    fontWeight: "bolder",
    [theme.breakpoints.down("sm")]: {
      fontSize: 20,
      padding: 15,
      gap: 7,
    },
  },
}));

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });
  const [userState, setUserState] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  const handleResize = () => {
    if (window.innerWidth < 1280) {
      setIsMobile(true);
    } else if (window.innerWidth < 1300) {
      setIsTablet(true);
    } else {
      setIsMobile(false);
      setIsTablet(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  React.useEffect(() => {
    if (window.innerWidth < 1280) {
      setIsMobile(true);
    } else if (window.innerWidth < 1300) {
      setIsTablet(true);
    } else {
      setIsMobile(false);
      setIsTablet(false);
    }
  }, []);

  const { user, setAlert, watchlist, coins, balance } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logout = () => {
    signOut(auth);
    setAlert({
      open: true,
      message: "See you again!",
      type: "success",
    });
    setTimeout(() => {
      refreshPage();
    }, 500);
  };

  const resetBalance = async () => {
    const walletRef = await doc(db, "wallet", user.uid);

    try {
      await setDoc(walletRef, {
        balances: { usd: 30000, btc: 0 },
      });

      setAlert({
        open: true,
        message: `You have reset your balance`,
        type: "success",
      });
    } catch (error) {}
  };

  const refreshPage = () => {
    window.location.reload(false);
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key="right">
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              cursor: "pointer",
              backgroundColor: "purple",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                {" "}
                <Avatar
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  style={{
                    height: !isMobile ? 150 : 75,
                    width: !isMobile ? 150 : 75,
                    cursor: "pointer",
                    backgroundColor: "#FFE227",
                  }}
                />{" "}
                <span
                  style={{
                    width: "100%",
                    fontSize: !isMobile ? 20 : 15,
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {" "}
                  {user.displayName || user.email}
                </span>
                <div
                  style={{
                    background: "rgba(79, 58, 84, 0.52)",
                    padding: 20,
                    borderRadius: "15px",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      color: "white",
                      fontWeight: "bolder",
                      wordWrap: "break-word",
                      fontSize: !isMobile ? 20 : 15,
                    }}
                  >
                    Wallet
                  </div>
                  <div
                    style={{
                      width: "240px",
                    }}
                  >
                    <hr></hr>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {" "}
                    <Typography
                      variant={!isMobile ? "h4" : "h6"}
                      style={{ color: "white", fontFamily: "VT323" }}
                    >
                      {balance?.usd?.toFixed(2)} USD
                    </Typography>
                    <Typography
                      variant={!isMobile ? "h4" : "h6"}
                      style={{ color: "white", fontFamily: "VT323" }}
                    >
                      {balance?.btc} BTC
                    </Typography>
                  </div>
                  <Button
                    style={{
                      background: "#FFE227",
                      display: "flex",
                      alignItems: "center",
                      border: "5px solid white",
                      color: "black",
                      fontWeight: "bolder",
                    }}
                    onClick={resetBalance}
                  >
                    {" "}
                    Reset Balance
                  </Button>
                </div>
                <div
                  style={{
                    color: "white",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                    fontSize: !isMobile ? 20 : 15,
                    marginTop: 20,
                  }}
                >
                  Portfolio Assets
                </div>
                <div
                  style={{
                    width: "240px",
                  }}
                >
                  <hr></hr>
                </div>
                <div
                  className={classes.watchlist}
                  style={{
                    overflowY: "auto",
                    maxHeight: !isMobile ? "225px" : "125px",
                  }}
                >
                  {coins.map((coin) => {
                    if (
                      watchlist?.includes(
                        watchlist.find((e) => e.id === coin.id)
                      )
                    )
                      return (
                        <div
                          style={{ display: "flex", alignItems: "center" }}
                          key={coin?.id}
                        >
                          <div style={{ marginRight: 20 }}>
                            <img
                              src={coin.image}
                              height={!isMobile ? "25" : "20"}
                            />
                          </div>
                          {coin.name}
                        </div>
                      );
                  })}
                </div>
              </div>
              <Button
                onClick={() => {
                  logout();
                }}
                style={{
                  background: "#FFE227",
                  marginRight: 80,
                  marginLeft: 80,
                  display: "flex",
                  alignItems: "center",
                  border: "5px solid white",
                  color: "black",
                  fontWeight: "bolder",
                }}
              >
                Logout
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
