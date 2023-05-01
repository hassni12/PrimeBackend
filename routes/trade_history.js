const express = require("express");
const router = express.Router();
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const Trade_History = require("../models/trade_history");
const { User } = require("../models/user");
const { Active_Trade } = require("../models/active_trades");
router.use(IsAdminOrUser);

router.get("/admincommission", async (req, res) => {
  try {
    const tradeHistory = await Trade_History.findAll();
    const activeTrades=await Active_Trade.findAll();

    let totalCommission = 0;
    for (const trade of tradeHistory) {
      totalCommission += trade.open_admin_profit;
    }
    for (const activetrade of activeTrades) {
      totalCommission += activetrade.admin_profit;
    }
    return res.send({ totalCommission });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/getall", async (req, res) => {
  try {
    const activeTrades=await Active_Trade.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "user_name",
            "first_name",
            "last_name",
            "email",
            "contact",
          ],
        },
      ],
      order: [["closed_at", "DESC"]],
    });
    const findHistoryUserId = await Trade_History.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "user_name",
            "first_name",
            "last_name",
            "email",
            "contact",
          ],
        },
      ],
      order: [["closed_at", "DESC"]],
    });

    const modifiedTradeHistory = findHistoryUserId.map((trade) => {
      if (trade.trade_type === "partial") {
        //trade.investment = trade.partial_user_value;
        //trade.purchase_units = trade.partial_units;
      } else {
        //trade.investment = trade.open_trade;

      }
      return trade;
    });

    const combinedData=[...activeTrades,...findHistoryUserId]

    return res.send(combinedData);
  } catch (error) {
    return res.send(error.message);
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    if (!req.params.user_id) return res.status(400).send("id required");
    const findHistoryUserId = await Trade_History.findAll({
      where: { user_id: req.params.user_id },
      order: [["closed_at", "DESC"]],
    });

    const modifiedTradeHistory = findHistoryUserId.map((trade) => {
      if (trade.trade_type === "partial") {
        //trade.investment = trade.partial_user_value;
        //trade.purchase_units = trade.partial_units;
      } else {
        let exist = false;
        for (let i = 0; i < findHistoryUserId.length; i++) {
          const td = findHistoryUserId[i];
          if (td.trade_id === trade.id) {
            exist = true;
            break;
          }
        }
        if (exist) {
          //trade.investment = trade.investment;
          // trade.purchase_units = trade.investment / trade.crypto_purchase_price;

        } else {
          // trade.investment = trade.open_trade;
          //trade.investment = trade.open_trade + trade.close_admin_profit; salman line
          //trade.purchase_units = trade.investment / trade.crypto_purchase_price;

        }
      }
      return trade;
    });

    return res.send(findHistoryUserId);
  } catch (error) {
    return res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!req.params.user_id) return res.status(400).send("id required");
    const findHistoryUserId = await Trade_History.findOne({
      where: { id: req.params.id },
    });
    if (!findHistoryUserId) return res.status(404).send("History not found");
    await findHistoryUserId.destroy();
    return res.send("deleted successfully");
  } catch (error) {
    return res.send(error.message);
  }
});
module.exports = router;
