const { DataTypes, Sequelize } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const { User } = require("./user");
const Joi = require("joi");

const User_Logs = connection.define(
  "user_logs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    from: {
      type: DataTypes.TEXT,
    },
    value: {
      type: DataTypes.INTEGER,
    },
    to: {
      type: DataTypes.TEXT,
    },
    tx_hash: {
      type: DataTypes.TEXT,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    tableName: "user_logs",
    timestamps: false,
  }
);

User_Logs.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
});
function validate(req) {
  const schema = Joi.object({
    user_id: Joi.required(),
  });

  return schema.validate(req);
}
module.exports = {
  User_Logs,
  validate,
};
