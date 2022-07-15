const jwt_decode = require("jwt-decode");
const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const config = require("../connectionConfig.json");

const accessTokenSecret = "youraccesstokensecret";

const getHashPassword = async (req, res, username, password) => {
  let conn;
  try {
    conn = oracledb.getConnection(config);
    const result = await conn.execute(
      `SELECT USER_PASS FROM S_APP.SAV_USERS WHERE USER_LOGIN = '${username}'`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    if (result.rows.length !== 0) {
      let currentHash = result.rows[0].USER_PASS;
      let salt = currentHash.substring(0, 64);
      let passHash = crypto
        .createHash("sha256")
        .update(salt + password)
        .digest("hex");
      let codePassword = salt.concat(passHash);

      if (codePassword === currentHash) {
        const accessToken = jwt.sign(
          { username: username },
          accessTokenSecret,
          {
            expiresIn: "1h",
          }
        );
        res.header("Authorization", `Bearer ${accessToken}`);
        console.log(accessToken);
        res.send(accessToken);
      } else {
        // res.send("Username or password is incorrect");
        res.send("Username or password is incorrect");
      }
    } else {
      res.send("Username or password is incorrect");
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

router
  .route("/")
  .get((req, res) => {})
  .post((req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    const { username, password } = req.body;
    getHashPassword(req, res, username, password);
  });

module.exports = router;
