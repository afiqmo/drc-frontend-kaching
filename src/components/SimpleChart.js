import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { CryptoState } from "../CryptoContext";
import Service from "../service/Service";

function SimpleChart({ coin }) {
  const { currency, setAlert } = CryptoState();

  const [histData, setHistData] = useState([]);
  const [days, setDays] = useState(1);

  const getHistoricalChart = (e, f, g) => {
    Service.getHistoricalChart(e, f, g)
      .then((response) => {
        setHistData(response.data.prices);
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
    getHistoricalChart(coin?.id, days, currency);
  }, [currency, days, coin?.id]);

  return (
    <div>
      <Line
        data={{
          labels: histData.map((chartData) => {
            let date = new Date(chartData[0]);
            let time = `${date.getHours()}:${date.getMinutes()} `;
            return days === 1 ? time : date.toLocaleDateString();
          }),
          datasets: [
            {
              data: histData.map((chartData) => chartData[1]),
              label: `Price of ${coin?.name} in the last ${days} days in ${currency}`,
              borderColor: "#FFE227",
              borderWidth: 2,
              pointBorderColor: "rgba(0,0,0,0)",
              pointBackgroundColor: "rgba(0,0,0,0)",
              pointHoverBorderColor: "#5AC53B",
              pointHitRadius: 6,
              fill: true,
              backgroundColor: "rgba(245, 238, 39, 0.25)",
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}

export default SimpleChart;
