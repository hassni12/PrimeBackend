const { DataTypes, Sequelize } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const { User } = require("./user");
const Joi = require("joi");

const admin_commision = connection.define(
  "admin_commision",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.DOUBLE(20, 8),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: "admin_commision",
    timestamps: false,
  }
);

function validatesv(req) {
  const schema = Joi.object({
    value: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
  admin_commision,
  validatesv,
};
