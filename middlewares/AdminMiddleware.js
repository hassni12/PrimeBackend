const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  if (!req.header("x-auth-token"))
    return res.status(401).send("authentication token required");
  try {
    const decodetoken = jwt.verify(req.header("x-auth-token"), "privateKey");
    req.user = decodetoken;
    if (decodetoken.is_admin) {
      next();
    } else {
      return res.status(401).send("Invalid Token.");
    }
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
};
