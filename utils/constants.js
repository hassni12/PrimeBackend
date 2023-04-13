const bcrypt = require("bcrypt");

module.exports = {
  ENCRYPT_PASSWORD: async (password) => await bcrypt.hash(password, 10),
  COMPARE_PASSWORD: async (password, hash) =>
    await bcrypt.compare(password, hash),
};
