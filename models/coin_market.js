const { DataTypes } = require("sequelize");
const connection = require("../utils/connection");
const Joi = require("joi");
const CoinMarket = connection.define(
  "coin_market",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    name: DataTypes.STRING,
    symbol: DataTypes.STRING,
    price: DataTypes.DOUBLE(30, 8),
    volume_24h: DataTypes.DOUBLE(30, 8),
    volume_change_24h: DataTypes.DOUBLE(30, 8),
    percent_change_1h: DataTypes.DOUBLE(30, 8),
    percent_change_24h: DataTypes.DOUBLE(30, 8),
    percent_change_7d: DataTypes.DOUBLE(30, 8),
    percent_change_30d: DataTypes.DOUBLE(30, 8),
    market_cap: DataTypes.DOUBLE(30, 8),
    max_supply: DataTypes.DOUBLE(30, 8),
    circulating_supply: DataTypes.DOUBLE(30, 8),
    total_supply: DataTypes.DOUBLE(30, 8),
    allow: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    tableName: "coin_market",
    timestamps: false,
  }
);

module.exports = CoinMarket;
