const data = require('../src/db/data.json');

module.exports = (req, res) => {
  res.status(200).json(data.doctors);
};
