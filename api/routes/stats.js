const express = require("express");
const JobApplication = require("../model/JobApplication");

const routes = express.Router();

routes.get("/stats", async (req, res) => {
  try {
    // Fetch job application data and statistics
    const totalApplications = await JobApplication.count();
    const interviewsScheduled = await JobApplication.count({
      where: { Status: "Interviewed" },
    });
    const offersReceived = await JobApplication.count({
      where: { Status: "Offered" },
    });

    // Calculate the distribution of applications by industry
    const industryDistribution = {};
    const applications = await JobApplication.findAll();
    applications.forEach((app) => {
      if (industryDistribution[app.industry]) {
        industryDistribution[app.industry]++;
      } else {
        industryDistribution[app.industry] = 1;
      }
    });

    const data = {
      totalApplications,
      interviewsScheduled,
      offersReceived,
      status: {
        applied: totalApplications,
        interviewed: interviewsScheduled,
        offered: offersReceived,
        rejected: totalApplications - interviewsScheduled - offersReceived,
      },
      industryDistribution,
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

module.exports = routes;
