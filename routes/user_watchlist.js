require("express-async-errors");
const express = require("express");
const { Op } = require("sequelize");
const { User_Watchlist, validateUW } = require("../models/user_watchlist");
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const router = express.Router();

router.use(IsAdminOrUser);

router.get("/:user_id", async (req, res) => {
  try {
    if (!req.params.user_id) return res.status(400).send("user id is missing");
    const watchlist = await User_Watchlist.findAll({
      where: { user_id: req.params.user_id },
    });

    return res.status(200).send(watchlist);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateUW(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const checkIfExist = await User_Watchlist.findAll({
      where: {
        [Op.and]: [
          { user_id: req.body.user_id },
          { coin_name: req.body.coin_name },
        ],
      },
    });
    if (checkIfExist.length > 0)
      return res.status(406).send("Already added to the watchlist");

    await User_Watchlist.create(req.body);
    return res.send("Added to the Watchlist");
  } catch (error) {
    return res.send(error.message);
  }
});

router.delete("/:user_id", async (req, res) => {
  try {
    const checkIfExist = await User_Watchlist.findOne({
      where: {
        [Op.and]: [
          { user_id: req.params.user_id },
          { coin_name: req.body.coin_name },
        ],
      },
    });
    if (!checkIfExist) return res.status(404).send("not found");

    await checkIfExist.destroy();
    return res.send("Deleted Successfully");
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = router;
