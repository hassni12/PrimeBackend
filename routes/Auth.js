const express = require("express");
const router = express.Router();
const config = require("config");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../models/user");
const { ENCRYPT_PASSWORD, COMPARE_PASSWORD } = require("../utils/constants");
const { Wallet } = require("../models/wallet");
const Trade_History = require("../models/trade_history");
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const isAdmin = require("../middlewares/AdminMiddleware");
const send = require("../utils/mailsend");
const logger = require("../utils/winston");
const Joi = require("joi");
const { Sequelize } = require("sequelize");
const ethers = require("ethers");
const TronWeb = require("tronweb");
const NodeRSA = require('node-rsa');
const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
});

router.post("/register", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let checkUsername = await User.findOne({
      where: { user_name: req.body.user_name },
    });

    if (checkUsername)
      return res.status(400).send("User Name is already taken.");

    let user = await User.findOne({ where: { email: req.body.email } });
    if (user)
      return res.status(400).send("User already registered with this gmail.");

    req.body.password = await ENCRYPT_PASSWORD(req.body.password);
    const createUser = await User.create(req.body);
    const ethWallet = ethers.Wallet.createRandom();
    const bscWallet = ethers.Wallet.createRandom();
    const tronAccount = await tronWeb.createAccount();

    console.log("Ethereum Wallet:");
    console.log("Address:", ethWallet.address);
    console.log("Private Key:", ethWallet.privateKey);

    console.log("\nBinance Smart Chain Wallet:");
    console.log("Address:", bscWallet.address);
    console.log("Private Key:", bscWallet.privateKey);

    console.log("\nTron Wallet:");
    console.log("Address:", tronAccount.address.base58);
    console.log("Private Key:", tronAccount.privateKey);
    const key = new NodeRSA({ b: 512 });
    const encryptedEthPrivateKey = key.encryptPrivate(
      ethWallet.privateKey,
      "base64",
      "utf8"
    );
    const encryptedBscPrivateKey = key.encryptPrivate(
      bscWallet.privateKey,
      "base64",
      "utf8"
    );
    const encryptedTronPrivateKey = key.encryptPrivate(
      tronAccount.privateKey,
      
      "base64",
      "utf8"
    );
   
    await Wallet.create({
      user_id: createUser.id,
      ethereum_wellet: ethWallet.address,
      ethereum_wellet_key: encryptedEthPrivateKey,
      tron_wellet: tronAccount.address.base58,
      tron_wellet_key: encryptedTronPrivateKey,
      bsc_wellet: bscWallet.address,
      bsc_wellet_key: encryptedBscPrivateKey,
    });
    let id = jwt.sign({ id: createUser.id }, config.get("jwtPrivateKey"), {
      expiresIn: "10m",
    });

    send(createUser.email, "Email Confirmation", "normal", id);

    return res.send({
      status: true,
    });
  } catch (error) {
    return res.send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).send("Invalid Email or Password.");

    const validPassword = await COMPARE_PASSWORD(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid Email or Password.");

    if (!user.is_email_verified)
      return res.status(400).send("Email is not verified.");

    if (!user.is_active_user)
      return res.status(400).send("User Blocked, Contact Support");

    const token = user.generateJwtToken();
    return res.send({ status: true, access: token });
  } catch (error) {
    return res.send(error.message);
  }
});

router.post("/accesstoadmin", isAdmin, async (req, res) => {
  try {
    let user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).send("Invalid Email Address");

    if (!user.is_email_verified)
      return res.status(400).send("Account Not Verified");

    const token = user.generateJwtToken();
    return res.send({ status: true, access: token });
  } catch (error) {
    return res.send(error.message);
  }
});

router.post("/email-verify", async (req, res) => {
  try {
    if (!req.body.email) return res.status(400).send("Please provide email.");

    const checkUser = await User.findOne({ where: { email: req.body.email } });
    if (!checkUser)
      return res.status(404).send("No User With This Email Address");
    let id = jwt.sign({ id: checkUser.id }, config.get("jwtPrivateKey"), {
      expiresIn: "10m",
    });
    logger.info("sending email to", req.body.email);
    send(
      checkUser.email,
      req.body.type ? "Forgot Password" : "Email Confirmation",
      req.body.type ? req.body.type : "normal",
      id
    );

    return res.send({ message: "Email is sent successfully." });
  } catch (error) {
    return res.send(error.message);
  }
});

router.post("/passwordreset/:user_id", async (req, res) => {
  try {
    if (!req.params.user_id) return res.status(400).send("user id is missing.");
    jwt.verify(req.body.token, config.get("jwtPrivateKey"));

    const checkUser = await User.findOne({ where: { id: req.params.user_id } });
    if (!checkUser) return res.status(404).send("No User Found WIth Given ID");

    const newPassword = await ENCRYPT_PASSWORD(req.body.password);
    checkUser.password = newPassword;
    await checkUser.save();
    if (req.body.forgot) {
      return res.render("emailconfirm", {
        title: "forgot password",
        status: "Password Updated.",
        icon: "t",
      });
    }
    return res.send("Password Updated.");
  } catch (error) {
    return res.render("emailconfirm", {
      title: "error",
      status: error.message,
      icon: "c",
    });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    if (!req.params.token)
      return res.status(400).send({ message: "Token is missing." });
    let tok = jwt.verify(req.params.token, config.get("jwtPrivateKey"));
    let user = await User.findOne({ where: { id: tok.id } });
    if (!user) return res.status(400).send("Link Expired..");
    if (user.is_email_verified) {
      return res.render("emailconfirm", {
        title: "Verified.",
        status: "Email Is Already Verified..",
        icon: "t",
      });
    } else {
      user.is_email_verified = true;
      await user.save();
    }

    return res.render("emailconfirm", {
      title: "Verified.",
      status: "Email Verified..",
      icon: "t",
    });
  } catch (error) {
    console.log(error.message);
    return res.render("emailconfirm", {
      title: "Expired",
      status: "Link Expired..",
      icon: "c",
    });
  }
});

router.get("/forgotform/:token", async (req, res) => {
  try {
    if (!req.params.token)
      return res.status(400).send({ message: "Token is missing." });
    let tok = jwt.verify(req.params.token, config.get("jwtPrivateKey"));
    let user = await User.findOne({ where: { id: tok.id } });
    if (!user) return res.status(400).send("Invalid Link");
    return res.render("forgotpass", { id: user.id, token: req.params.token });
  } catch (error) {
    console.log(error.message);
    return res.render("emailconfirm", {
      title: "Expired",
      status: "Link Expired",
      icon: "c",
    });
  }
});

router.get("/getall", IsAdminOrUser, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "user_name",
        "first_name",
        "last_name",
        "email",
        "contact",
        "is_active_user",
        "is_admin",
        [
          Sequelize.literal(
            "(SELECT balance FROM wallet WHERE user_id = user.id)"
          ),
          "balance",
        ],
        [
          Sequelize.literal(
            "(SELECT SUM(actual_profit) FROM trade_history WHERE user_id = user.id)"
          ),
          "actual_profit",
        ],
        [
          Sequelize.literal(
            "(SELECT SUM(ABS(actual_loss)) FROM trade_history WHERE user_id = user.id)"
          ),
          "actual_loss",
        ],
        "created_at",
      ],
    });

    return res.send(users);
  } catch (error) {
    return res.send(error.message);
  }
});

router.get("/:user_id", IsAdminOrUser, async (req, res) => {
  try {
    if (!req.params.user_id)
      return res.status(400).send("user id is required.");
    const user = await User.findOne({ where: { id: req.params.user_id } });
    if (!user) return res.status(404).send("no users found");

    return res.send(user);
  } catch (error) {
    return res.send(error.message);
  }
});

const passValidate = (req) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
      .regex(
        RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
      )
      .message(
        "Password must contain at least one uppercase one lowercase one special character and one number "
      ),
  });

  return schema.validate(req);
};
module.exports = router;
