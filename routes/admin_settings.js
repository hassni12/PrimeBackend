const express = require("express");
const { admin_settings, validatesv } = require("../models/admin_setting");
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const router = express.Router();
router.use(IsAdminOrUser);
router.get("/", async (req, res) => {
  try {
    const settings = await admin_settings.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });
    if (!settings.length > 0) return res.send({ });
    return res.send(settings[0]);
  } catch (error) {
    return res.send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validatesv(req.body);
    if (error) return res.status(400).send(error.details[0].message);

   const settings=await admin_settings.findOne({where:{id:req.body.pk}})

   if(!settings){
    await admin_settings.create(req.body)
   }else{
     await settings.update(
       { ...req.body },
       { returning: true, where: { id: req.body.pk } }
     );
   }

    return res.send("settings updated");
  } catch (error) {
    return res.send(error.message);
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
