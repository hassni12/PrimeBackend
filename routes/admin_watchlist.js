const express = require("express");
const { Op } = require("sequelize");
const { Admin_Watchlist, validateAW } = require("../models/admin_watchlist");
const IsAdmin = require("../middlewares/AdminMiddleware");
const router = express.Router();

router.use(IsAdmin);

router.get("/", async (req, res) => {
  try {
    const watchlist = await Admin_Watchlist.findAll();

    res.status(200).send(watchlist);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateAW(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const checkIfExist = await Admin_Watchlist.findAll({
      where: {
        coin_name: req.body.coin_name,
      },
    });
    if (checkIfExist.length > 0)
      return res.status(400).send("Already added to the watchlist");

    const watchlist = await Admin_Watchlist.create(req.body);
    return res.send("Added to the Watchlist");
  } catch (error) {
    return res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const checkIfExist = await Admin_Watchlist.findOne({
      where: {
        id: req.params.id,
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
