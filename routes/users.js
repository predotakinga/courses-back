const express = require("express");
const router = express.Route();
const oracledb = require("oracledb");

const config = require("../connectionConfig.json");

const userMiddleware = (req, res, next) => {
  next();
};

const getUsers = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const result = await conn.execute(
      "SELECT USER_ID, USER_NAME, USER_LOGIN, USER_PASS FROM S_APP.SAV_USERS",
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

const getUser = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const result = await conn.execute(
      `SELECT USER_ID, USER_NAME, USER_LOGIN, USER_PASS FROM S_APP.SAV_USERS WHERE USER_ID = ${req.params.id}`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
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
  .get(userMiddleware, (req, res) => {
    getUsers(req, res);
  })
  .put((req, res) => {
    // res.send("Updating user");
  })
  .delete((req, res) => {
    // res.send("deleting user");
  });

router.route("/:id").get(userMiddleware, (req, res) => {
  getUser(req, res);
});

module.exports = router;
