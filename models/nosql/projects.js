const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
    user: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    client: { type: mongoose.Types.ObjectId, ref: "clients", required: true },
    archived: { type: Boolean, default: false }
  }, {
    timestamps: true,
    versionKey: false
  });
  
  module.exports = mongoose.model("projects", ProjectSchema);