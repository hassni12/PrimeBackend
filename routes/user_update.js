const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const { ENCRYPT_PASSWORD, COMPARE_PASSWORD } = require("../utils/constants");
const multerImageHandler = require("../middlewares/multermiddleware");
const IsAdminOrUser = require("../middlewares/AuthMiddleware");
const cloudinary = require("../utils/cloudinaryuploader");
const Joi = require("joi");

router.use(IsAdminOrUser);

router.put(
  "/img/:user_id",
  multerImageHandler.single("image"),
  async (req, res) => {
    try {
      if (!req.params.user_id) return res.status(400).send("user is required.");
      if (!req.body.image) return res.status(404).send("Please Provide Image.");

      const checkUser = await User.findOne({
        where: { id: req.params.user_id },
      });
      if (!checkUser)
        return res.status(404).send("No User Found WIth Given ID");

      const cloudinaryLink = await cloudinary.uploader.upload(req.file.path);
      checkUser.avatar = cloudinaryLink.secure_url;

      await checkUser.save();
    } catch (error) {
      return res.send(error.message);
    }
  }
);

router.put("/passwordchange/:user_id", async (req, res) => {
  try {
    if (!req.params.user_id)
      return res.status(400).send("Please Provide User Id.");
    const { error } = passValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const checkUser = await User.findOne({ where: { id: req.params.user_id } });
    if (!checkUser)
      return res.status(404).send("No User Found WIth Given ID");

    const validPassword = await COMPARE_PASSWORD(
      req.body.password,
      checkUser.password
    );
    if (!validPassword) return res.status(400).send("Incorrect  Password.");
    const newPassword = await ENCRYPT_PASSWORD(req.body.new_password);
    checkUser.password = newPassword;
    await checkUser.save();

    return res.send("Password Updated");
  } catch (error) {
    return res.send(error.message);
  }
});

router.put("/:user_id", async (req, res) => {
  try {
    const { error } = validateFieldsToUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    if (req.body.user_name) {
      let checkUsername = await User.findOne({
        where: { user_name: req.body.user_name },
      });
      if (checkUsername)
        return res.status(400).send("User Name is already taken.");
    }
    const checkUser = await User.findOne({ where: { id: req.params.user_id } });
    if (!checkUser)
      return res.status(404).send("No User Found WIth Given ID");

    await User.update(
      { ...req.body },
      { returning: true, where: { id: req.params.user_id } }
    );
    return res.send("values updated");
  } catch (error) {
    return res.send(error.message);
  }
});

const passValidate = (req) => {
  const schema = Joi.object({
    password: Joi.string().required(),
    new_password: Joi.string()
      .min(5)
      .max(255)
      .required()
      .regex(
        RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
      )
      .message(
        "Password must contain at least one uppercase one lowercase one special character and one number "
      )
      .invalid(Joi.ref("password")),
  });

  return schema.validate(req);
};

function validateFieldsToUpdate(req) {
  const schema = Joi.object({
    user_name: Joi.string().optional().min(5).max(255),
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    contact: Joi.string().optional(),
    is_active_user: Joi.boolean().optional()
  });

  return schema.validate(req);
}

module.exports = router;
