import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Sharifah from "../asset/sharifah.png";
import Esther from "../asset/esther.png";
import Nic from "../asset/nic.png";
import Afifi from "../asset/afifi.png";
import Faiz from "../asset/faiz.png";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    padding: 50,
    marginTop: 50,
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "space-evenly",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      paddingRight: "20",
      paddingLeft: "20",
      marginTop: 0,
      padding: 0,
    },
  },
  teamContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 30,
    margin: 15,
    borderRadius: "15px",
    background: "rgba(79, 58, 84, 0.52)",
  },
}));

function Team() {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.container}>
        <Typography variant="h2" style={{ fontFamily: "VT323" }}>
          The Mastermind
        </Typography>
      </div>
      <div className={classes.container}>
        <div
          data-aos="flip-up"
          data-aos-duration="1500"
          className={classes.teamContainer}
        >
          <img src={Afifi} alt="coin pic" height={"250px"} />
          <Typography
            variant="h4"
            style={{ fontFamily: "VT323", marginTop: 15 }}
          >
            Afifi
          </Typography>
          <Typography variant="h5" style={{ fontFamily: "VT323" }}>
            DevSecOps
          </Typography>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="1500"
          className={classes.teamContainer}
        >
          <img src={Sharifah} alt="coin pic" height={"250px"} />
          <Typography
            variant="h4"
            style={{ fontFamily: "VT323", marginTop: 15 }}
          >
            Sharifah
          </Typography>
          <Typography variant="h5" style={{ fontFamily: "VT323" }}>
            Product Design & Front-End
          </Typography>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="1500"
          className={classes.teamContainer}
        >
          <img src={Nic} alt="coin pic" height={"250px"} />
          <Typography
            variant="h4"
            style={{ fontFamily: "VT323", marginTop: 15 }}
          >
            Nic
          </Typography>
          <Typography variant="h5" style={{ fontFamily: "VT323" }}>
            Front-End & Quants
          </Typography>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="1500"
          className={classes.teamContainer}
        >
          <img src={Esther} alt="coin pic" height={"250px"} />
          <Typography
            variant="h4"
            style={{ fontFamily: "VT323", marginTop: 15 }}
          >
            Esther
          </Typography>
          <Typography variant="h5" style={{ fontFamily: "VT323" }}>
            Quality Assurance
          </Typography>
        </div>
        <div
          data-aos="flip-up"
          data-aos-duration="1500"
          className={classes.teamContainer}
        >
          <img src={Faiz} alt="coin pic" height={"250px"} />
          <Typography
            variant="h4"
            style={{ fontFamily: "VT323", marginTop: 15 }}
          >
            Faiz
          </Typography>
          <Typography variant="h5" style={{ fontFamily: "VT323" }}>
            Product Design & Front-End
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default Team;
