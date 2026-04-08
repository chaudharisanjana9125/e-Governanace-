const Application = require("../models/Application");

exports.applyService = async (req, res) => {
  const { userId, serviceName } = req.body;
  const app = await Application.create({ userId, serviceName });
  res.json(app);
};

exports.getStatus = async (req, res) => {
  const apps = await Application.find({ userId: req.params.userId });
  res.json(apps);
};