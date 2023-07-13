const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  if (!req.header("x-auth-token"))
    return res.status(401).send("authentication token required");
  try {
    const decodetoken = jwt.verify(req.header("x-auth-token"), "privateKey");
    req.user = decodetoken;
    // console.log(decodetoken ,"token decode");
    if (decodetoken.is_admin || decodetoken.is_active) {
      next();
    } else {
      return res.status(401).send("Invalid Token");
    }
  } catch (error) {
    return res.status(401).send("invalid token");
  }
};
