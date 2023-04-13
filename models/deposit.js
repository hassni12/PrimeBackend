const { DataTypes, Sequelize } = require("sequelize");
const connection = require("../utils/connection");
const moment = require("moment");
const { User } = require("./user");
const Joi = require("joi");

const Deposit = connection.define(
  "deposit_requests",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DOUBLE(20, 8),
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    status_description: {
      type: DataTypes.TEXT,
      defaultValue: "Wait while we process your request",
    },
    requested_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    tableName: "deposit_requests",
    timestamps: false,
  }
);

Deposit.belongsTo(User, {
  as: "user",
  foreignKey: "user_id",
});

function validateD(req) {
  const schema = Joi.object({
    amount: Joi.required(),
    user_id: Joi.required(),
  });

  return schema.validate(req);
}

module.exports = {
  Deposit,
  validateD,
};
