import { Button, Container, Typography, makeStyles } from "@material-ui/core";
import React, { useState } from "react";

import Coin from "../asset/mariocoin.gif";
import { CryptoState } from "../CryptoContext";
import Kaching from "../asset/kaching.mp3";
import LogoWord from "../asset/logoword.png";
import Mario from "../asset/mario3.gif";
import MarioStay from "../asset/mario-ready.gif";
import { useNavigate } from "react-router-dom";

const useStyle = makeStyles((theme) => ({
  banner: {
    backgroundPosition: "center center",
    minHeight: "100vh",
    background:
      "linear-gradient(0deg, rgba(255,255,255,0.3) 0%, rgba(150,150,150,0.5) 100%), url(https://www.themasterpicks.com/wp-content/uploads/2020/04/22b22287602523.5dbd29081561d.gif)",
    backgroundSize: "100%",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      height: 700,
    },
  },
  bannerContent: {
    margin: "0",
    paddingTop: 25,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      paddingTop: 10,
    },
  },
  hello: {
    background: "rgb(107,13,116)",
    background:
      "linear-gradient(180deg, rgba(52,11,54,1) 0%, rgba(245,0,255,0.4514180672268907) 28%, rgba(255,255,255,1) 75%)",
    boxShadow: "10px 10px 63px -3px rgba(0,0,0,0.69)",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 90,
    width: "50%",
    [theme.breakpoints.down("md")]: {
      width: "85%",
      height: "90%",
      paddingTop: 40,
      padding: 20,
      justifyContent: "space-evenly",
    },
  },
  investor: {
    fontSize: "5rem",
    marginBottom: 5,
    paddingRight: 20,
    paddingLeft: 20,
    fontFamily: "VT323",
    color: "#FFFFFF",
    [theme.breakpoints.down("md")]: {
      fontSize: "44px",
      marginBottom: 0,
      paddingRight: 5,
      paddingLeft: 5,
      alignItems: "center",
      justifyContent: "center",
    },
  },
  adventure: {
    fontSize: "3rem",
    marginBottom: 50,
    paddingRight: 20,
    paddingLeft: 20,
    fontFamily: "VT323",
    color: "#FFFFFF",
    [theme.breakpoints.down("md")]: {
      fontSize: "30px",
      padding: 0,
      marginBottom: 0,
    },
  },
  buttonStart: {
    backgroundColor: "#FFE227",
    color: "black",
    border: "5px solid white",
    fontFamily: "VT323",
    fontSize: 20,
    marginLeft: 50,
    [theme.breakpoints.down("md")]: {
      marginLeft: 0,
    },
  },
  coingif: {
    [theme.breakpoints.down("md")]: {
      height: 70,
    },
  },
  mariogif: {
    height: 150,
    [theme.breakpoints.down("md")]: {
      height: 70,
    },
  },
}));
function WelcomePage() {
  const classes = useStyle();
  const navigate = useNavigate();
  const [isClick, setIsClick] = useState(false);
  const playSound = () => {
    var kaching = new Audio(Kaching);
    kaching.play();
    kaching.onended = () => {
      kaching.setAttribute("src", "");
    };
  };
  const { setAlert } = CryptoState();

  return (
    <div className={classes.banner}>
      <Container maxWidth="xl" className={classes.bannerContent}>
        <div className={classes.hello}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {" "}
            <img
              src={LogoWord}
              alt="kaching"
              style={{
                marginBottom: 50,
                paddingLeft: 20,
              }}
            />
            <Typography className={classes.investor}>
              Hello Investor!
            </Typography>
            <Typography className={classes.adventure}>
              Are you ready for an adventure?
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {" "}
            {isClick ? (
              <img className={classes.coingif} src={Coin} alt="coins" />
            ) : (
              <img
                className={classes.coingif}
                style={{ visibility: "hidden" }}
                src={Coin}
                alt="coins"
              />
            )}
            <Button
              className={classes.buttonStart}
              variant="contained"
              onClick={() => {
                playSound();
                setIsClick(true);
                setTimeout(() => {
                  navigate("/homepage");
                  setAlert({
                    open: true,
                    message: `Now Playing: A Town With An Ocean View`,
                    type: "info",
                  });
                }, 650);
              }}
            >
              Let's Start!
            </Button>
            {!isClick ? (
              <img
                className={classes.mariogif}
                src={MarioStay}
                alt="mario collect coins"
              />
            ) : (
              <img
                className={classes.mariogif}
                src={Mario}
                alt="mario collect coins"
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
export default WelcomePage;
