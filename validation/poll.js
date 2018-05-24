const validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validatePollInput(data) {
  let errors = {};

  data.pollqtext = !isEmpty(data.pollqtext) ? data.pollqtext : "";

  if (!validator.isLength(data.pollqtext, { min: 10, max: 300 })) {
    errors.pollqtext = "Poll must be between 10 & 300 characters";
  }

  if (validator.isEmpty(data.pollqtext)) {
    errors.pollqtext = "pollqtext field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
