const express = require("express");
const router = express.Router;
const oracledb = require("oracledb");
const jwt_decode = require("jwt-decode");

const config = require("../connectionConfig.json");

const getMyCourses = async (req, res) => {
  let conn;
  let decoded = jwt_decode(req.headers.authorization.slice(7));
  let username = decoded.username;
  let userID;

  try {
    conn = await oracledb.getConnection(config);
    const result = await conn.execute(
      `SELECT USER_ID FROM S_APP.SAV_USERS WHERE USER_LOGIN='${username}'`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    userID = result.rows[0].USER_ID;
  } catch (err) {
    console.log(err);
  }

  try {
    conn = await oracledb.getConnection(config);
    const result = await conn.execute(
      `SELECT * FROM S_KURSY.SAV_COURSES WHERE ID IN (SELECT COURSE_ID from S_KURSY.SAV_COURSES_USERS WHERE USER_ID = ${userID} AND DATA_WYPISU IS NULL )`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    res.send(result.rows);
    // console.log(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

router.route("/").get((req, res) => {
  getMyCourses(req, res);
});

module.exports = router;
