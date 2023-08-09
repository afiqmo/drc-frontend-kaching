import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import Service from "./service/Service";

const Crypto = createContext();

function CryptoContext({ children }) {
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [balance, setBalance] = useState({});
  const [receipt, setReceipt] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalInfo, setGlobalInfo] = useState();
  const [open, setOpen] = useState(false);
  const [authValue, setAuthValue] = useState(0);
  const [portfolioVol, setPortfolioVol] = useState(0);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const getCoinList = (currency) => {
    setLoading(true);

    Service.getCoinList(currency)
      .then((response) => {
        setCoins(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: `API request exceed 50 limit, please wait 1 minute`,
          type: "error",
        });
      });
  };

  useEffect(() => {
    setLoading(true);
    getCoinList(currency);
  }, [currency]);

  const getGlobalInfo = async () => {
    setLoading(true);

    await Service.getGlobalInfo()
      .then((response) => {
        setGlobalInfo(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setAlert({
          open: true,
          message: `API request exceed 50 limit, please wait 1 minute`,
          type: "error",
        });
      });
  };

  useEffect(() => {
    setLoading(true);
    getGlobalInfo();
  }, []);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      const walletRef = doc(db, "wallet", user?.uid);
      const transactionRef = doc(db, "transaction", user?.uid);

      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setWatchlist(coin.data().coins);
        } else {
        }
      });
      var unsubscribe2 = onSnapshot(walletRef, (wallet) => {
        if (wallet.exists()) {
          setBalance(wallet.data().balances);
        } else {
        }
      });
      var unsubscribe3 = onSnapshot(transactionRef, (transaction) => {
        if (transaction.exists()) {
          setReceipt(transaction.data().receipts);
        } else {
        }
      });
      return () => {
        unsubscribe();
        unsubscribe2();
        unsubscribe3();
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (currency === "MYR") setSymbol("RM");
    else if (currency === "USD") setSymbol("$");
    else if (currency === "EUR") setSymbol("€");
    else if (currency === "JPY") setSymbol("¥");
    else if (currency === "GBP") setSymbol("£");
    else if (currency === "AUD") setSymbol("$");
    else if (currency === "CAD") setSymbol("$");
  }, [currency]);

  return (
    <Crypto.Provider
      value={{
        watchlist,
        user,
        currency,
        symbol,
        setCurrency,
        alert,
        setAlert,
        coins,
        loading,
        setLoading,
        globalInfo,
        open,
        setOpen,
        authValue,
        setAuthValue,
        setPortfolioVol,
        portfolioVol,
        balance,
        receipt,
        setReceipt,
      }}
    >
      {children}
    </Crypto.Provider>
  );
}

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
