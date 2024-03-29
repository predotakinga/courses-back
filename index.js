const path = require("path");
const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

const auth = require("./middleware/auth");

const usersRoutes = require("./routes/users.js");
const coursesRoutes = require("./routes/courses.js");
const loginRoutes = require("./routes/login.js");
const mycoursesRoutes = require("./routes/mycourses.js");
const limitRoutes = require("./routes/limit.js");
const joinCourseRoutes = require("./routes/joincourse.js");
const signOffCourseRoutes = require("./routes/signoffcourse.js");

app.use("/users", usersRoutes);
app.use("/login", loginRoutes);
app.use("/courses", auth, coursesRoutes);
app.use("/limit", limitRoutes);
app.use("/mycourses", auth, mycoursesRoutes);
app.use("/joincourse", auth, joinCourseRoutes);
app.use("/signoffcourse", auth, signOffCourseRoutes);
app.get("/", (req, res) => {
  res.send("hello world i'm kingusia");
});

const port = process.env.PORT || 8080;

app.use("/", express.static(path.join(__dirname, "testheroku")));

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});

// const PORT = process.env.PORT || 3002;

// app().listen(PORT, () => console.log(`Listening on ${PORT}`));
