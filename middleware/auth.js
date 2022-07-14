const jwt = require("jsonwebtoken");

const accessTokenSecret = "youraccesstokensecret";

module.exports = (req, res, next) => {
  let jwtSecretKey = accessTokenSecret;
  try {
    let token = req.headers.authorization.slice(7).replaceAll('"', "");
    //console.log(token);
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.status(200), next();
    } else {
      return res.status(401).send(error);
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};
