const express = require("express");
const router = express.Router;
const oracledb = require("oracledb");
const jwt_decode = require("jwt-decode");

const config = require("../connectionConfig.json");

const signOffCourse = async (req, res) => {
  let conn;
  let decoded = jwt_decode(req.headers.authorization.slice(7));
  let usernameToQuery = decoded.username;

  let userID;
  let courseID = req.body.courseID;
  let date = req.body.date;

  try {
    conn = await oracledb.getConnection(config);
    const result = await conn.execute(
      `SELECT * FROM S_APP.SAV_USERS WHERE USER_LOGIN='${usernameToQuery}'`,
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    userID = result.rows[0].USER_ID;
  } catch (err) {
    console.log(err);
  }
  console.log(req.body.date); // console.log(dateFormatted);

  try {
    conn = await oracledb.getConnection(config);
    await conn.execute(
      `UPDATE SAV_COURSES_USERS SET DATA_WYPISU=TO_DATE('${date}', 'yyyy-mm-dd') WHERE USER_ID=${userID} AND COURSE_ID=${courseID}`,
      [],
      { autoCommit: true }
    );
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

router.route("/").post((req, res) => {
  signOffCourse(req, res);
});

module.exports = router;
