const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION, // Replace with your AWS region
  credentials: {
    accessKeyId: process.env.IAM_USER_KEY, // Replace with your AWS access key
    secretAccessKey: process.env.IAM_USER_SECRET, // Replace with your AWS secret access key
  },
});

// Set up multer for in-memory storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME, // Replace with your S3 bucket name
    acl: "public-read", // Adjust permissions as needed
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${path.basename(file.originalname)}`); // File name with timestamp
    },
  }),
});

module.exports = upload;
