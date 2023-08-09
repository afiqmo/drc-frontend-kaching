# The Math Behind Portfolio Page

This file will **briefly explain** the math behind Ka-Ching! user portfolio page.

# Profit Estimation

![](https://i.ibb.co/QKKh47g/profitestimation.png)

Profit estimation estimation of a portfolio is given by the average return of a portfolio for the last time frame (24H, 30D, or 1Y):

$$
R_p = \sum_i^n  w_i r_i\,
$$

$$
w_i = \frac{h_i p_i}{P_p}  \,.
$$

> where
> $R_p$ is the portfolio return.
> $w_i$ is the weightage of the portfolio asset.
> $r_i$ is the return of each asset in the last (24H, 30D, or 1Y)
> $h_i$ is the holding of each coin.
> $p_i$ is the current price of the coin.
> $P_p$ is the price of portfolio.

```
userCoin3?.reduce((sum, coin) => {

if (watchlist?.includes(watchlist?.find((e) =>  e.id ===
coin?.id))) {

return (

sum +

(coin?.market_data[period] *

coin?.holding *

coin?.market_data?.current_price[currency?.toLowerCase()]) /

totalWeight

);

} else {

return  sum + 0;

}

}, 0)
```

the total weight, $P_p$:

```
const  totalWeight = userCoin3?.reduce((sum, coin) => {

if (watchlist?.includes(watchlist?.find((e) =>  e.id ===
coin?.id))) {

return (

sum +

coin.holding *

coin?.market_data?.current_price[currency?.toLowerCase()]

);

} else {

return  sum + 0;

}

}, 0);
```

note that the return or price change percentage is fetched from the API.

## Historical Portfolio Value

![](https://i.ibb.co/n6RZsCb/historicalportfoliovalue.png)
Historical portfolio value is just the price of the portfolio, we can get the value of portfolio at time, $t$, if we sum all the coin in the basket times its holding:

$$
 P_t = \sum_i^n h_{it}p_{it}
$$

Since, we have an array of {time: time, price: price} for every coin, we need to loop it through the array to get the price at every time, $t$.

```
const  portfolioPriceChart = () => {

const  dateData = coinsd2[0]?.hist_data.map((e) =>  e[0]);



const  arrPrice = coinsd2?.map((e) =>

e?.hist_data.map((v) =>  v[1] * e.coin.holding)

);



const  avgPrice = (...arrays) => {

const  n = arrays.reduce((max, xs) =>  Math.min(max, xs.length),
1000);

const  result = Array.from({ length:  n });

return  result.map((_, i) =>

arrays.map((xs) =>  xs[i] || 0).reduce((sum, x) =>  sum + x, 0)

);

};



return { time:  dateData, avg_return:  avgPrice(...arrPrice) };

};
```

The result would be an array of {time: $t$ price: $P_t$}

## Normalized Coin Price

![](https://i.ibb.co/ncncjNm/coinprice.png)

Since in crypto world the price of coins can be differ by a large margin. e.g: bitcoin(17k USD) and dogecoin(<1 USD). It hard to see the trend of each coins in one single graph, hence the normalization:

$$
P_{normalized} = \frac{P - P_{min}}{P_{max}- P_{min}}
$$

Then we need to loop this through all the coins inside the portfolio and display the graph:

```
const  data1 = e.hist_data?.map((chartData) =>  chartData[1]);

const  ratio = Math.max(...data1) - Math.min(...data1);
const  min = Math.min(...data1);
const  data2 = data1.map((v) => (v - min) / ratio)
};
if (
watchlist.includes(watchlist.find((watch) =>
watch.id === e?.coin?.id))
) {

return {

data:  data2,

};
```

## Historical Return

Historical return of the portfolio is shows the graph of returns at time, $t$, for the past (24H, 30D or 1Y)

The historical return at time, $t$ , is given by:

$$
R_p = \sum_i^n  w_i r_i\,
$$

$$
w_i = \frac{h_i  p_i}{P_p}  \,.
$$

Note that the equation is the same as profit estimation. But now, the difference is we also need to find the returns for each time, $t$.

The simple returns is given by:

$$
 R_t = \frac{P_t - P_{t-1}}{P_{t-1}}
$$

But in our case, for the reasons of :

- Symmetry
- time-additivity
- viewing economic data

we use the logarithmic return:

$$
R_t = ln(P_{t})-ln(P_{t-1})
$$

and then we need to loop through every coin in the basket and loop through every time, $t$:

```
const  portfolioReturnChart = () => {

const  totalWeight = coinsd?.reduce(

(sum, coin) =>  sum + coin?.coin?.holding *
coin?.coin?.current_price,

0

);

const  dateData = coinsd2[0]?.hist_return_data[0];



const  arrReturn = coinsd2.map((e) =>

e?.hist_return_data[1].map(

(v) => (v * e?.coin?.holding * e?.coin?.current_price) /
totalWeight

)

);



const  avgReturn = (...arrays) => {

const  n = arrays.reduce((max, xs) =>  Math.max(max, xs.length),
0);

const  result = Array.from({ length:  n });

return  result.map((_, i) =>

arrays.map((xs) =>  xs[i] || 0).reduce((sum, x) =>  sum + x, 0)

);

};



return { time:  dateData, avg_return:  avgReturn(...arrReturn) };

};
```

## Volatility of Portfolio

![](https://i.ibb.co/Rhxnn4T/volatility.png)

Volatility represents how large an asset's prices swing around the mean price—it is a statistical measure of its dispersion of returns.

It is given by:

$$
\sigma_{portfolio} = \sqrt(var(aX+bY+cZ))
$$

where,

$$
var(aX+bY+cZ) = a^2var(X) +b^2var(Y) +c^2var(Z) +C
$$

where,

$$
C = 2cov(X,Y) + 2cov(X,Z) + 2cov(Z,Y)
$$

and,

$$
var(aX) =a^2 \sum_i^n \frac{(x_i- \overline{x})}{N}
$$

and,

$$
cov(aX,bY) = ab\sum_i^n \frac{(x_i- \overline{x}) (y_i- \overline{y}) }{N}
$$

First, we need to get the variance of each coins, and of course, we need to use the array of log returns:

```
const  coinsd2 = coinsd?.map((e) => {

const  totalWeight = coinsd?.reduce(

(sum, coin) =>  sum + coin?.coin?.holding * coin?.coin?.current_price,

0

);

const  sdReturn = (arr = e.price_return) => {

const  sum = arr.reduce((acc, val) =>  acc + val);

const { length: num } = arr;

const  median = sum / num;

const  sumx = arr.reduce((acc, val) =>  acc + val - median);

let  variance = 0;

arr.forEach((num) => {

variance += (num - median) * (num - median);

});

variance /= num;

return {

sum: ((e?.coin?.holding * e.coin?.current_price) / totalWeight) * sumx,

sd_return:

((e?.coin?.holding * e.coin?.current_price) / totalWeight) *

((e?.coin?.holding * e.coin?.current_price) / totalWeight) *

variance,

};

};



const  sdPrice = (arr = e.price_data) => {

const  sum = arr.reduce((acc, val) =>  acc + val);

const { length: num } = arr;

const  median = sum / num;

const  sumx = arr.reduce((acc, val) =>  acc + val - median);

let  variance = 0;

arr.forEach((num) => {

variance += (num - median) * (num - median);

});

variance /= num;

return {

sum: ((e?.coin?.holding * e.coin?.current_price) / totalWeight) * sumx,

sd_price:

((e?.coin?.holding * e.coin?.current_price) / totalWeight) *

((e?.coin?.holding * e.coin?.current_price) / totalWeight) *

variance,

};

};



return {

...e,

stats_return:  sdReturn(),

stats_price:  sdPrice(),

total_weight:  totalWeight,

};

});
```

this will yield the variance of return and variance of price times its weightage, $var(aX)$ , and the sum of data minus their mean, $\sum_i^n(x-\overline{x})$.

Both of these values are use to produce volatility table for coins in portfolio.
![](https://i.ibb.co/Jvvw9HK/voltable.png)

From here, we can get the volatility of portfolio. The formula can be separated into two terms.

The first term is the sum of each coins variance times its weightage squared, $a^2var(X) +b^2var(Y) +c^2var(Z) + ... + w^2var(N)$

and the second term is the sum of covariance of each permutation of pairs, $2cov(X,Y) + 2cov(X,Z) + 2cov(Z,Y) + ... + 2cov(N,M)$

and then we can just sum both terms together to get the volatility of portfolio:

```
const  portfolioVolatility = () => {

const  pricestat = coinsd2?.map((e) =>  e.stats_price);

const  returnstat = coinsd2?.map((e) =>  e.stats_return);



const  n_denomenator = coinsd2[0]?.price_data?.length;



const  price_sum_var =

pricestat &&

pricestat

.map((stat) =>  stat.sd_price)

?.reduce((acc, val) =>  acc + val, 0);



const  return_sum_var =

returnstat &&

returnstat

.map((stat) =>  stat.sd_return)

?.reduce((acc, val) =>  acc + val, 0);



const  price_sum_cov =

pricestat &&

pricestat

.map((v, i, a) =>

a

.filter((_, _i) =>  _i !== i)

.reduce((p, c) =>  p + (v.sum * c.sum) / n_denomenator, 0)

)

.reduce((p, v) =>  p + v, 0);



const  return_sum_cov =

returnstat &&

returnstat

.map((v, i, a) =>

a

.filter((_, _i) =>  _i !== i)

.reduce((p, c) =>  p + (v.sum * c.sum) / n_denomenator, 0)

)

.reduce((p, v) =>  p + v, 0);



return {

price_sd:  Math.sqrt(price_sum_cov + price_sum_var),

return_sd:  Math.sqrt(return_sum_cov + return_sum_var) * 100,

};

};
```

## Epilogue

Regards,
Amir Ahmad (nic)
