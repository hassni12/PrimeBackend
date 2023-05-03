const express = require("express");
const CoinMarket = require("../models/coin_market");
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const coins = await CoinMarket.findAll();

    res.status(200).send(coins);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

module.exports = router;
