const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const jwt = require("jsonwebtoken");

const config = require("../connectionConfig.json");

const getCourses = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const result = await conn.execute("select * from s_kursy.SAV_COURSES", [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.send(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

const getCourse = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const result = await conn.execute(
      `SELECT * FROM S_KURSY.SAV_COURSES WHERE ID = ${req.params.id}`,
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

router.route("/").get((req, res) => {
  getCourses(req, res);
});

router.route("/:id").get((req, res) => {
  getCourse(req, res);
});

module.exports = router;
