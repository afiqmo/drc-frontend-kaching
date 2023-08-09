import axios from "axios";

const getNews = () => {
  const options = {
    method: "GET",
    url: "https://bing-news-search1.p.rapidapi.com/news/search",
    params: {
      q: "crypto",
      count: "100",
      freshness: "Day",
      textFormat: "Raw",
      safeSearch: "Off",
    },
    headers: {
      "X-BingApis-SDK": "true",
      "X-RapidAPI-Key": "3d9f218cd9msh6ec38d67cd750d4p1fade7jsn46775a6ee3bb",
      "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
    },
  };

  return axios.request(options);
};

export default getNews;
