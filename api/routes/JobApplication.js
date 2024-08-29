const express = require("express");

const controller = require("../controller/JobsApplication");
const auth = require("../middleware/Auth");
const upload = require("../middleware/multer");

const route = express.Router();

route.post(
  "/add-job",
  upload.single("resume"),
  auth.authorized,
  controller.addJobs
);

route.post("/job-applications", auth.authorized, controller.getData);

route.get("/job-details/:jobId", auth.authorized, controller.getById);

route.post("/update-job-status/:jobId", auth.authorized, controller.updateById);

route.get("/get-note/:jobId", auth.authorized, controller.getNote);

route.post("/save-note/:jobId", auth.authorized, controller.addNotes);

route.get("/status-summary", auth.authorized, controller.getStatus);

route.get("/user-data", auth.authorized, controller.getProfile);

route.put(
  "/update-user",
  upload.none(),
  auth.authorized,
  controller.updateUser
);

module.exports = route;
