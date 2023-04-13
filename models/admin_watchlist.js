const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const Joi = require("joi");
const Admin_Watchlist = connection.define(
  "admin_watchList",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    coin_name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "admin_watchList",
    timestamps: false,
  }
);

function validateAW(req) {
  const schema = Joi.object({
    coin_name: Joi.string().required(),
  });
  return schema.validate(req);
}
module.exports = {
  Admin_Watchlist,
  validateAW,
};
