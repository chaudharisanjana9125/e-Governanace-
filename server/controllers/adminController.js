const Application = require("../models/Application");

exports.getAll = async (req, res) => {
  const apps = await Application.find();
  res.json(apps);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const app = await Application.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  res.json(app);
};