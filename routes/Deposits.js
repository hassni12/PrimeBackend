const express = require("express");
const { Deposit, validateD } = require("../models/deposit");
const { Wallet } = require("../models/wallet");
const { User } = require("../models/user");
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const router = express.Router();
router.use(IsAdminOrUser);
router.get("/", async (req, res) => {
  try {
    const getAllRequests = await Deposit.findAll({
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
    console.log(req.user.id ,"id");
    const depositQuery =
     Deposit.findAll({
     
      where: { user_id: req.params.id },
      order: [['requested_at', 'DESC']]
    });
    const walletQuery = Wallet.findAll({
      where: { user_id: req.params.user_id },
    }); 
    const [depositResults, walletResults] = await Promise.all([depositQuery, walletQuery]);
    

    return res.json({depositResults, walletResults});
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.get("/wallets/:walletType", async (req, res) => {
  try {
    // const userId = req.params.userId;
    const walletType = req.params.walletType;
    const allowedWalletTypes = ["ethereum", "tron", "bsc"];
    if (!allowedWalletTypes.includes(walletType)) {
      return res.status(400).send("Invalid wallet type.");
    }

    const wallet = await Wallet.findOne({
      where: { user_id: req.user.id },
      attributes: [`${walletType}_wellet`]
    });

    if (!wallet) {
      return res.status(404).send(`Wallet not found for the user (${walletType}_wellet).`);
    }
    return res.send({wallet:wallet[`${walletType}_wellet`]});
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateD(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const checkIfUser = await User.findOne({ where: { id: req.body.user_id } });
    if (!checkIfUser) return res.status(500).send("internal server error");

    if (req.body.amount <= 0) return res.status(406).send("Invalid Amount");

    await Deposit.create(req.body);

    return res.status(200).send("Request Sent successfully");
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!req.body.status)
      return res.status(400).send("status or status description not provided.");

    const depositRequest = await Deposit.findOne({
      where: { id: req.params.id },
    });

    if (!depositRequest) return res.status(404).send("request not found.");


    if (depositRequest.status !== "approved") {
      depositRequest.status = req.body.status;
      depositRequest.status_description = req.body.status_description
        ? req.body.status_description
        : "reason not specified";

      const userWallet = await Wallet.findOne({
        where: { user_id: depositRequest.user_id },
      });
      if (!userWallet) return res.status(404).send("Wallet Not Found");

      if (req.body.status === "approved") {
        userWallet.balance += parseFloat(depositRequest.amount);
        await userWallet.save();
      }
      await depositRequest.save();

      return res.status(200).send("updated");
    }
    else {
      return res.status(400).send("request already approved");
    }

  } catch (error) {
    return res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const checkIfExist = await Deposit.findOne({
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
