import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./Pages/Homepage";
import CoinPage from "./Pages/CoinPage";
import { makeStyles } from "@material-ui/core";
import "./App.css";
import AlertSnackbar from "./components/AlertSnackbar";
import PageNotFound from "./Pages/PageNotFound";
import WelcomePage from "./Pages/WelcomePage";
import PriceHorizontal from "./components/PriceHorizontal";
import CoinListPage from "./Pages/CoinListPage";
import PortfolioPage from "./Pages/PortfolioPage";
import NewsPage from "./Pages/news";
import TradePage from "./Pages/TradePage";
import TransactionPage from "./Pages/TransactionPage";

const useStyles = makeStyles(() => ({
  app: {
    backgroundColor: "#212121",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.app}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route element={<MainPageLayout />}>
            <Route path="/coinList" element={<CoinListPage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/coins/:id" element={<CoinPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/transaction" element={<TransactionPage />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function MainPageLayout() {
  return (
    <>
      <Header />
      <PriceHorizontal />
      <Outlet />
      <AlertSnackbar />
      <Footer />
    </>
  );
}

export default App;
