const express = require("express");
const { Withdraw, validateW } = require("../models/withdraw");
const { Wallet } = require("../models/wallet");
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const { User } = require("../models/user");
const router = express.Router();

router.use(IsAdminOrUser);

router.get("/", async (req, res) => {
  try {
    const getAllRequests = await Withdraw.findAll({
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
      order: [['requested_at', 'DESC']]
    });
    return res.send(getAllRequests);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const getAllRequestsByUserId = await Withdraw.findAll({
      where: { user_id: req.params.user_id },
      order: [['requested_at', 'DESC']]
    });

    return res.send(getAllRequestsByUserId);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateW(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userWallet = await Wallet.findOne({
      where: { user_id: req.body.user_id },
    });
    if (!userWallet) return res.status(404).send("Wallet not created");
    if (userWallet.balance < req.body.amount)
      return res.status(406).send("balance is less then your withdraw amount.");

    if (req.body.amount <= 0) return res.status(406).send("Invalid Amount");

    userWallet.balance -= req.body.amount;
    await userWallet.save();

    await Withdraw.create(req.body);

    return res.status(200).send("Request Sent successfully");
  } catch (error) {
    return res.send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const WithdrawRequest = await Withdraw.findOne({
      where: { id: req.params.id },
    });


    const userWallet = await Wallet.findOne({
      where: { user_id: WithdrawRequest.user_id },
    });
    if (!req.params.id) return res.status(400).send("Id is not provided.");
    else if (!WithdrawRequest) return res.status(404).send("request not found.");
    else if (WithdrawRequest.status === "canceled") return res.status(406).send("request already completed or canceled");
    else if (WithdrawRequest.status === "approved") return res.status(406).send("request already completed or canceled");
    else if (!userWallet) return res.status(404).send("Wallet Not Found");
    else if (WithdrawRequest.status === "pending" && req.body.status === "canceled") {
      WithdrawRequest.status = req.body.status;
      WithdrawRequest.status_description = req.body.status_description
        ? req.body.status_description
        : "reason not specified";
      userWallet.balance += parseFloat(WithdrawRequest.amount);
      await userWallet.save();
      await WithdrawRequest.save();

      return res.status(200).send("updated");
    }
    else if (WithdrawRequest.status === "pending" && req.body.status === "approved") {
      WithdrawRequest.status = req.body.status;
      WithdrawRequest.status_description = req.body.status_description
        ? req.body.status_description
        : "reason not specified";
      await WithdrawRequest.save();
    }
    else
      return res.status(406).send("Invalid Status");

  } catch (error) {
    return res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const checkIfExist = await Withdraw.findOne({
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
