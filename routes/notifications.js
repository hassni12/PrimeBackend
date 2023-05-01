require("express-async-errors");
const express = require("express");
const { Op } = require("sequelize");
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const { Notifications, validateN } = require("../models/notifications");
const router = express.Router();
router.use(IsAdminOrUser);


router.get("/", async (req, res) => {
  try {
    const notifications = await Notifications.findAll({
      order: [['created_at', 'DESC']]
    });

    return res.status(200).send(notifications);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validateN(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const notif = await Notifications.create(req.body);

    req.io.emit("newNotification", notif)
    return res.send("Notification Added");
  } catch (error) {
    return res.send(error.message);
  }
});

router.put("/single/:id", async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).send("Please Provide ID to Update Record Status");
    if (!req.body.user_id)
      return res.status(400).send("User Id is required");
    const checkNotification = await Notifications.findAll({ where: { id: req.params.id } });
    if (!checkNotification.length > 0)
      return res.status(404).send("Notifications Not Found");

    checkNotification.forEach((noti) => {
      if (noti.status) {
        let st = noti.status.split(",");
        let exist = false;
        st.forEach((t) => {
          if (parseInt(t) === parseInt(req.body.user_id)) {
            exist = true;
          }
        });
        if (!exist) {
          st.push(`${req.body.user_id}`);
        }
        noti.status = st.toString();
      } else {
        noti.status = `${req.body.user_id}`;
      }
      noti.save();
    });

    req.io.emit("newNotification", { message: "Read" });
    return res.send("status updated.");
  } catch (error) {
    return res.send(error.message);
  }
});


router.put("/hide/:id", async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).send("Please Provide Id To Update.");
    if (!req.body.user_id)
      return res.status(400).send("User Id is required");
    const checkNotification = await Notifications.findAll({ where: { id: req.params.id } });
    if (!checkNotification.length > 0)
      return res.status(404).send("Notifications Not Found");

    checkNotification.forEach((noti) => {
      if (noti.hide) {
        let st = noti.hide.split(",");
        let exist = false;
        st.forEach((t) => {
          if (parseInt(t) === parseInt(req.body.user_id)) {
            exist = true;
          }
        });
        if (!exist) {
          st.push(`${req.body.user_id}`);
        }
        noti.hide = st.toString();
      } else {
        noti.hide = `${req.body.user_id}`;
      }
      noti.save();
    });

    req.io.emit("newNotification", { message: "hidden" });
    return res.send("hidden.");
  } catch (error) {
    return res.send(error.message);
  }
});

router.put("/show/:id", async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).send("Please Provide Id To Update.");
    if (!req.body.user_id)
      return res.status(400).send("User Id is required");
    const checkNotification = await Notifications.findAll({ where: { id: req.params.id } });
    if (!checkNotification.length > 0)
      return res.status(404).send("Notifications Not Found");

    checkNotification.forEach((noti) => {
      if (noti.hide) {
        let st = noti.hide.split(",");
        let index = st.indexOf(`${req.body.user_id}`);
        if (index !== -1) {
          st.splice(index, 1);
        }
        noti.hide = st.toString();
        noti.save();
      }
    });

    req.io.emit("newNotification", { message: "shown" });
    return res.send("shown.");
  } catch (error) {
    return res.send(error.message);
  }
})


router.put("/:id", async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).send("Please Provide ID to Update Record Status");

    const checkNotification = await Notifications.findAll();
    if (!checkNotification.length > 0)
      return res.status(404).send("Notifications Not Found");

    checkNotification.forEach((noti) => {
      if (noti.status) {
        let st = noti.status.split(",");
        let exist = false;
        st.forEach((t) => {
          if (parseInt(t) === parseInt(req.params.id)) {
            exist = true;
          }
        });
        if (!exist) {
          st.push(`${req.params.id}`);
        }
        noti.status = st.toString();
      } else {
        noti.status = `${req.params.id}`;
      }
      noti.save();
    });
    req.io.emit("newNotification", { message: "Read" })
    return res.send("status updated.");
  } catch (error) {
    return res.send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const checkIfExist = await Notifications.findOne({
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
