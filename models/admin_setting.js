const { DataTypes,Sequelize } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const { User } = require("./user");
const Joi = require("joi");

const admin_settings = connection.define(
  "admin_settings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    commission: {
      type: DataTypes.FLOAT,
    },
    marketApiKey:{
      type:DataTypes.FLOAT
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue:  Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: "admin_settings",
    timestamps: false,
  }
);

function validatesv(req) {
  const schema = Joi.object({
    pk:Joi.required(),
    commission: Joi.optional(),
    marketApiKey: Joi.optional(),
  });

  return schema.validate(req);
}

module.exports = {
  admin_settings,
  validatesv,
};
