const config = require("config");
const axios = require("axios");
const { Active_Trade } = require("../models/active_trades");
const { Admin_Watchlist } = require("../models/admin_watchlist");
const CoinMarket = require("../models/coin_market");
const cryptoSymbols=require("../symbols")
const { Op } = require("sequelize");

module.exports = async () => {
  try {
    let res = await getCoinMarketData();
    let data = await filterWithAdminWatchlist(res.data.data);
    // console.log(data);
    console.log("in function");
    const active_trades = await Active_Trade.findAll();
    // console.log(data);

    if (data.length === 0) return console.log("returned from data");
    if (active_trades.length > 0) {
      active_trades.forEach((x) => {
        const { crypto_name, purchase_units, take_profit, stop_loss } = x;
        data.forEach((i) => {
          // console.log("looping data");
          if (i.name === crypto_name) {
            // console.log("condition true--");
            let price = i.price;
            // console.log(price);
            let val = price * purchase_units;

            if (val >= take_profit + x.trade && take_profit !== 0) {
              console.log("in profit");
              deleteTrade(x.id, price);
            } else if (val <= x.trade - stop_loss && stop_loss !== 0) {
              console.log("in loss");
              deleteTrade(x.id, price);
            }
          }
        });
      });
      return console.log("ok");
    }
    return;
  } catch (error) {
    return console.log(error.message);
  }
};

const getCoinMarketData = async () => {
  let url = config.get("MarketApi");
  console.log(url);
  return await axios.get(url).catch((error) => console.log(error));
};

const filterWithAdminWatchlist = async (coins) => {
  try {
    if (coins.length > 0) {
      const adminwathlist = await Admin_Watchlist.findAll({ raw: true });
      const todeleteCoins = adminwathlist.map((c) => c.coin_name);
      const extractAndFilterCoinData = coins.map((c) => {
        const {
          price,
          volume_24h,
          volume_change_24h,
          percent_change_1h,
          percent_change_24h,
          percent_change_7d,
          percent_change_30d,
          market_cap,
        } = c.quote.USD;
        return {
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          price: price,
          volume_24h: volume_24h,
          volume_change_24h: volume_change_24h,
          percent_change_1h: percent_change_1h,
          percent_change_24h: percent_change_24h,
          percent_change_7d: percent_change_7d,
          percent_change_30d: percent_change_30d,
          market_cap: market_cap,
          max_supply: c.max_supply,
          circulating_supply: c.circulating_supply,
          total_supply: c.total_supply,
        };
      });
      const removeUnusedCoins = extractAndFilterCoinData.filter(c =>
        cryptoSymbols.includes(c.symbol)
      );      
      const filterOnExtraction = removeUnusedCoins.map(
        (c) => {
          if(todeleteCoins.includes(c.name)){
            return {
              ...c,
              allow:false,
            }
          }else{
            return {
              ...c,
              allow:true,
            }
          }
        }
      );
      await CoinMarket.bulkCreate(filterOnExtraction, {
        updateOnDuplicate: [
          "symbol",
          "price",
          "volume_24h",
          "volume_change_24h",
          "percent_change_1h",
          "percent_change_24h",
          "percent_change_7d",
          "percent_change_30d",
          "market_cap",
          "max_supply",
          "circulating_supply",
          "total_supply",
          "allow"
        ],
      });

      return filterOnExtraction;
    } else return [];
  } catch (error) {
    console.log(error.message);
  }
};

const deleteTrade = async (id, price) => {
  console.log(id, price);
  let url = config.get("baseurl");
  console.log(url);
  return await axios
    .delete(`${url}/api/activetrade/` + id, {
      data: {
        crypto_sale_price: price,
      },
    })
    .catch((error) => console.log(error));
};
