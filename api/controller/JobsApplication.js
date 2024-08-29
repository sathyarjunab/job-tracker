const sequelize = require("sequelize");

const sgMail = require("@sendgrid/mail");
const schedule = require("node-schedule");

sgMail.setApiKey(process.env.EMAIL_API);

exports.addJobs = async (req, res) => {
  try {
    const data = { ...req.body };
    const msg = {
      to: req.user.email,
      from: "sathyarjun007@gmail.com",
      subject: "Scheduled Email",
      text: "This is a scheduled email.",
    };
    function sendEmail() {
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    const specificDate = new Date(data.applicationDate);
    schedule.scheduleJob(specificDate.toISOString(), sendEmail);
    await req.user.createJobApplication({
      CompanyName: data.companyName,
      JobTitle: data.jobTitle,
      Date: data.applicationDate,
      Status: data.status,
      ContactDetails: data.contactDetails,
      CompanySize: data.companySize,
      industry: data.industry,
      Description: data.description,
      Resume: req.file.location,
    });
    res.status(200).send({ message: "created" });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getData = async (req, res) => {
  try {
    const data = req.body;
    const whereClause = {};
    if (data.search || data.status || data.role || data.date) {
      if (data.search) {
        whereClause[sequelize.Op.or] = [
          { JobTitle: { [sequelize.Op.like]: `%${data.search}%` } },
          { CompanyName: { [sequelize.Op.like]: `%${data.search}%` } },
        ];
      }
      if (data.status) {
        whereClause.status = data.status;
      }
      if (data.role) {
        whereClause.CompanySize = data.role;
      }
      if (data.date) {
        whereClause.Date = { [sequelize.Op.eq]: data.date };
      }

      const jobApplications = await req.user.getJobApplications({
        where: whereClause,
      });
      res.status(200).send(jobApplications);
    } else {
      const data = await req.user.getJobApplications();
      res.status(200).send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getById = async (req, res) => {
  try {
    const apllicationId = req.params.jobId;
    const applicationDetails = await req.user.getJobApplications({
      where: {
        id: apllicationId,
      },
    });
    res.status(200).send(applicationDetails[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.updateById = async (req, res) => {
  try {
    const apllicationId = req.params.jobId;
    const applicationDetails = await req.user.getJobApplications({
      where: {
        id: apllicationId,
      },
    });
    applicationDetails[0].Status = req.body.status;
    await applicationDetails[0].save();
    res.status(200).send(applicationDetails);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getNote = async (req, res) => {
  try {
    const note = await req.user.getJobApplications({
      where: {
        id: req.params.jobId,
      },
    });
    res
      .status(200)
      .send({ message: "data may be there or not", text: note[0].Notes });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.addNotes = async (req, res) => {
  try {
    const apllicationId = req.params.jobId;
    const applicationDetails = await req.user.getJobApplications({
      where: {
        id: apllicationId,
      },
    });
    applicationDetails[0].Notes = req.body.note;
    const a = await applicationDetails[0].save();
    console.log(a);
    res.status(200).send({ message: "done and dusted" });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getStatus = async (req, res) => {
  try {
    const statusCounts = await req.user.getJobApplications({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      group: "status",
    });

    const counts = statusCounts.reduce((acc, jobApp) => {
      const { status, count } = jobApp.dataValues;
      acc[status] = count;
      return acc;
    }, {});

    const allStatuses = ["applied", "interviewed", "offered", "rejected"];
    let counter = 0;
    const stats = allStatuses.map((status) => {
      if (!counts[status]) {
        return 0;
      } else {
        counter += counts[status];
        return counts[status];
      }
    });
    res.status(200).send({ stats, counter });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getProfile = (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const ans = req.user.update({
      UserName: req.body.name,
      Email: req.body.email,
      PhoneNumber: req.body.phone,
      Location: req.body.location,
      CareerGoals: req.body.careerGoals,
      JobPreferences: req.body.jobPreferences,
      Skills: req.body.skills,
      EducationalBackground: req.body.EducationalBackground,
    });
    // req.user.save();
    res.status(200).send(ans);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
