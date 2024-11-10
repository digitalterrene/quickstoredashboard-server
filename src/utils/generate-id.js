const { randomBytes } = require("crypto");

const generateId = () => {
  const uid =
    Math.random().toString(36).slice(2) +
    randomBytes(8).toString("hex") +
    new Date().getTime();
  return uid;
};

module.exports = { generateId };
