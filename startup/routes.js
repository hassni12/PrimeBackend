const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const authRouter = require("../routes/Auth");
const depositRouter = require("../routes/Deposits");
const withdrawRouter = require("../routes/Withdraw");
const walletRouter = require("../routes/Wallet");
const userWatchlistRouter = require("../routes/user_watchlist");
const adminWatchlistRouter = require("../routes/admin_watchlist");
const activeTradeRouter = require("../routes/Active_Trades");
const activeTradeHistory = require("../routes/trade_history");
const coinMarketRouter = require("../routes/coin_market");
const profileUpdateRouter = require("../routes/user_update");
const adminNotifyRouter = require("../routes/notifications");
const adminSettingRouter=require("../routes/admin_settings");
const adminPackagesRouter=require("../routes/package");
const packagePurchaseRouter=require("../routes/purchase");


var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

module.exports = function (app) {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('images'))
  app.use(morgan("tiny"));
  app.get("/", async (req, res) => {
    res.send("working");
  });
  app.use("/api/user", authRouter);
  app.use("/api/deposit", depositRouter);
  app.use("/api/withdraw", withdrawRouter);
  app.use("/api/wallet", walletRouter);
  app.use("/api/userwatchlist", userWatchlistRouter);
  app.use("/api/adminwatchlist", adminWatchlistRouter);
  app.use("/api/activetrade", activeTradeRouter);
  app.use("/api/tradehistory", activeTradeHistory);
  app.use("/coinmarket", coinMarketRouter);
  app.use("/api/profile/", profileUpdateRouter);
  app.use("/api/admin/notification/", adminNotifyRouter);
  app.use("/api/setting",adminSettingRouter)
  app.use("/api/package",adminPackagesRouter)
  app.use("/api/purchase",packagePurchaseRouter)
};
