const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const Joi = require("joi");

const User_Watchlist = connection.define(
  "user_watchlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    coin_name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "user_watchlist",
    timestamps: false,
  }
);

function validateUW(req) {
  const schema = Joi.object({
    user_id: Joi.required(),
    coin_name: Joi.string().required(),
  });
  return schema.validate(req);
}

module.exports = {
  User_Watchlist,
  validateUW,
};
