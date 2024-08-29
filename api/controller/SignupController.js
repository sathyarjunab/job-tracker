const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/UserModel");

exports.signupPost = async (req, res) => {
  try {
    if (req.body.phone.length > 10) {
      return res.status(400).send({ message: "Invalid Phone Number" });
    }
    const existingUser = await User.findOne({
      where: { Email: req.body.email },
    });
    if (!existingUser) {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        const user = await User.create({
          UserName: req.body.name,
          Email: req.body.email,
          PhoneNumber: req.body.phone,
          Password: hash,
        });
        const token = jwt.sign(user.id, process.env.TOKEN_SECRET);
        res.status(201).json({
          message: "user as been created successfully",
          result: user,
          token: token,
        });
      });
    } else {
      res.status(404).send({ message: "User Already Exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.loginPost = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      bcrypt.compare(req.body.password, user.Password, (err, result) => {
        if (err) {
          throw new Error(err);
        }
        const token = jwt.sign(user.id, process.env.TOKEN_SECRET);
        if (result) {
          res.status(200).send({ token: token, user: user.UserName });
        } else {
          res.status(404).send({ message: "User Is Not Authorized" });
        }
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const up = await req.user.update({
      Location: req.body.location,
      CareerGoals: req.body.careerGoals,
      JobPreferences: req.body.jobPreferences,
      Skills: req.body.skills,
      EducationalBackground: req.body.education,
    });
    res.status(200).send({ message: "done", up });
  } catch (err) {
    console.log(err);
  }
};
