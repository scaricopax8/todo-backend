const userDAO = require("./dao");

exports.getUsers = async () => {
  return userDAO.getUsers();
};
