const express = require("express");
const router = express.Router;
const oracledb = require("oracledb");

const config = require("../connectionConfig.json");

const getLimit = async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(config);
    const result = await conn.execute(
      "SELECT COUNT(DISTINCT USER_ID) as ILOSC_UCZESTNIKOW, id FROM SAV_COURSES left join sav_courses_users on ID=course_id WHERE DATA_WYPISU IS NULL group by id",
      [],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );
    res.send(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

router.route("/").get((req, res) => {
  getLimit(req, res);
});

module.exports = router;
