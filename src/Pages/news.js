import getNews from "../service/newsservice";
import { CircularProgress, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import news from "../asset/crypto_news.gif";

const useStyles = makeStyles((theme) => ({
  newsbox: {
    background:
      "linear-gradient(180deg, rgba(107,13,116,0.4) 0%, rgba(255,226,39,0.2) 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    padding: 20,
    width: "25%",
    margin: 15,
    borderRadius: "15px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "flex-start",
    },
  },

  container: {
    display: "flex",
    padding: 50,

    [theme.breakpoints.down("md")]: {
      flexDirection: "column-reverse",
      alignItems: "center",
      padding: 20,
    },
  },
  left: {
    width: "50%",
    padding: 50,
    [theme.breakpoints.down("md")]: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: 20,
    },
  },
  right: {
    display: "flex",
    marginRight: 50,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  leftSub: {
    paddingRight: 20,
    paddingLeft: 20,
    fontFamily: "VT323",
    marginBottom: 30,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    [theme.breakpoints.down("md")]: {
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
}));

function NewsPage() {
  const classes = useStyles();
  const [articles, setArticles] = useState([]);
  const [show, setshow] = useState(6);
  const showMoreNews = () => {
    setshow((preValue) => preValue + 3);
  };

  useEffect(() => {
    getNews().then((e) => setArticles(e.data.value));
  }, []);

  return (
    <>
      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className={classes.container}>
          <div className={classes.left}>
            <Typography
              className={classes.leftSub}
              variant="h1"
              style={{
                color: "#FFE227",
              }}
            >
              Crypto News
            </Typography>
            <Typography
              className={classes.leftSub}
              variant="h3"
              style={{
                color: "white",
              }}
            >
              Stay up-to-date with latest news on major cryptocurrencies
            </Typography>
          </div>
          <div className={classes.right}>
            <img src={news} alt="news" height={300} />
          </div>
        </div>

        {articles ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              minHeight: "500px",
            }}
          >
            {articles
              .slice(0, show)
              .sort(function (a, b) {
                return new Date(b.datePublished) - new Date(a.datePublished);
              })
              .map((article, i) => {
                return (
                  <div
                    data-aos="fade-up"
                    className={classes.newsbox}
                    onClick={() => {
                      window.open(article?.url);
                    }}
                    style={{ cursor: "pointer" }}
                    key={i}
                  >
                    <div>
                      <div style={{ display: "flex", margin: 10 }}>
                        <div style={{ marginRight: 20 }}>
                          <img
                            src={
                              article?.image?.thumbnail?.contentUrl
                                ? article?.image?.thumbnail?.contentUrl
                                : "https://thumbs.dreamstime.com/b/forbidden-sign-no-pass-bypassing-icon-pixel-art-style-black-passing-bypass-unique-color-high-definition-perfect-web-149381794.jpg"
                            }
                            height={100}
                          />
                        </div>

                        <Typography
                          style={{ fontWeight: "bolder", color: "white" }}
                        >
                          {article?.name}
                        </Typography>
                      </div>

                      <Typography
                        style={{ color: "#F6F6F6", marginBottom: "revert" }}
                      >
                        {article.description.length > 100
                          ? `${article.description.substring(0, 100)}...`
                          : article.description}
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={
                              article.provider[0]?.image?.thumbnail?.contentUrl
                                ? article.provider[0]?.image?.thumbnail
                                    ?.contentUrl
                                : "https://thumbs.dreamstime.com/b/forbidden-sign-no-pass-bypassing-icon-pixel-art-style-black-passing-bypass-unique-color-high-definition-perfect-web-149381794.jpg"
                            }
                            height={30}
                            style={{ marginRight: 5, borderRadius: "50%" }}
                          />
                          <p>{article?.provider[0]?.name}</p>
                        </div>
                        <p style={{ color: "#FFE227" }}>
                          {`${moment(article?.datePublished)
                            .startOf("ss")
                            .fromNow()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div style={{ minHeight: "500px" }}>
            {" "}
            <CircularProgress />
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: 20,
          }}
        >
          <button
            onClick={showMoreNews}
            style={{
              fontFamily: "VT323",
              fontSize: 20,
              backgroundColor: "#FFE227",
              color: "black",
              border: "5px solid white",
              borderRadius: "15px",
              padding: 10,
              cursor: "pointer",
            }}
          >
            Load More
          </button>
        </div>
      </div>
    </>
  );
}

export default NewsPage;
