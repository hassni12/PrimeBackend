const config = require("config");
const { Sequelize } = require("sequelize");
const { DATABASE, USERNAME, PASSWORD, HOST, PORT } = config.get("DBCONFIG");
console.log(DATABASE, USERNAME, PASSWORD, HOST, PORT);
module.exports = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: "mysql",
  logging: false,
  port: PORT,
});
