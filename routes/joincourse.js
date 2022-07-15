const express = require("express");
const router = express.Route();
const oracledb = require("oracledb");
const jwt_decode = require("jwt-decode");

const config = require("../connectionConfig.json");

const joinCourse = async (req, res) => {
  let conn;
  let decoded = jwt_decode(req.headers.authorization.slice(7));
  let usernameToQuery = decoded.username;

  let username;
  let userID;
  let courseID = req.body.courseID;
  let userEmail;
  let date = new Date(req.body.date);

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
    userEmail = result.rows[0].EMAIL;
    username = result.rows[0].USER_NAME;
  } catch (err) {
    console.log(err);
  }

  conn = oracledb.getConnection(config, function (err, connection) {
    connection.execute(
      `INSERT INTO S_KURSY.SAV_COURSES_USERS (USER_ID, USER_NAME, COURSE_ID, USER_EMAIL, DATA_ZAPISU) VALUES (:user_id, :user_name, :course_id, :user_email, :data_zapisu)`,
      [userID, username, courseID, userEmail, date],
      { autoCommit: true }
    );
  });
};

router.route("/").post((req, res) => {
  joinCourse(req, res);
});

module.exports = router;
