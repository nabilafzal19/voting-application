const moment = require("moment");

function formatMessage(text) {
  return {
    // username,
    text,
    time: moment().format("h:m:A"),
  };
}

module.exports = formatMessage;
