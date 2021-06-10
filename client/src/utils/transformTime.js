const moment = require("moment");
/**
 *
 * @param     時間
 * @return    yyyy-MM-dd hh:mm 格式的時間
 */

export const formatMessage = (message) => {
  let timestamp = message.time;
  message.time = moment(timestamp).format("YYYY/MM/DD hh:mm A");
  return message;
  // let date = moment(timestamp).format("YYYY/MM/DD hh:mm A");
  // return date;
};
export const toNormalTime = (timestamp) => {
  let date = moment(timestamp).format("YYYY/MM/DD hh:mm A");
  return date;
};
