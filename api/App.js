const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const sequelize = require("./util/DataBase");
const User = require("./model/UserModel");
const JobApplication = require("./model/JobApplication");
const signupRoutes = require("./routes/SignupRoute");
const jobRoutes = require("./routes/JobApplication");
const statsRoute = require("./routes/stats");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);

app.use(signupRoutes);
app.use(jobRoutes);
app.use(statsRoute);

User.hasMany(JobApplication);
JobApplication.belongsTo(User);

// { force: true }
sequelize
  .sync()
  .then((result) => {
    app.listen(3001, () => {
      console.log("connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
