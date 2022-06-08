const dbValidators = require("./db-validators");
const generateJWT = require("./generate-jwt");
const googleVerify = require("./google-verify");
const uploadFiles = require("./upload-files");
const checkJWT = require("./check-jwt");

module.exports = {
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...uploadFiles,
  ...checkJWT,
};
