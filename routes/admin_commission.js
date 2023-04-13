const express = require("express");
const { admin_commision, validatesv } = require("../models/admin_commission");
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const router = express.Router();
router.use(IsAdminOrUser);
router.get("/", async (req, res) => {
  try {
    const getValue = await admin_commision.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });
    if (!getValue.length > 0) return res.send({ value: 0 });
    return res.send(getValue[0]);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validatesv(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    req.body.value = parseFloat(req.body.value);

    await admin_commision.create(req.body);

    return res.send("Request Sent successfully");
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const checkIfExist = await admin_commision.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!checkIfExist) return res.status(404).send("not found");
    await checkIfExist.destroy();
    return res.send("deleted successfuly");
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = router;
