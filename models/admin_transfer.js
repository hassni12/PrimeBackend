const { DataTypes, Sequelize } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const { User } = require("./user");
const Joi = require("joi");

const admin_transfer = connection.define(
  "admin_transfer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.STRING,
    },
    passcode: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "admin_transfer",
    timestamps: false,
  }
);

function validatesv(req) {
  const schema = Joi.object({
    amount: Joi.required(),
   
  });

  return schema.validate(req);
}

module.exports = {
  admin_transfer,
  validatesv,
};
