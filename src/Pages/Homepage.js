import React from "react";
import Banner from "../components/Banner";
import Kiki from "../asset/kiki.mp3";
import Sound from "react-sound";
import Trending from "../components/Trending";
import GlobalMarket from "../components/GlobalMarket";
import FavCoin from "../components/FavCoin";
import TradeSimulation from "../components/TradeSimulation";
import Team from "../components/Team";

function Homepage() {
  return (
    <div>
      <Sound
        url={Kiki}
        playStatus={Sound.status.PLAYING}
        playFromPosition={0 /* in milliseconds */}
      />
      <Banner />
      <Trending />
      <GlobalMarket />
      <FavCoin />
      <TradeSimulation />
      <Team />
    </div>
  );
}

export default Homepage;
