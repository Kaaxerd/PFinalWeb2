const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nif: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  postalCode: { type: String },
  city: { type: String },
  province: { type: String },
  archived: { type: Boolean, default: false },
  createdBy: { type: mongoose.Types.ObjectId, ref: "users" },
  company: { type: mongoose.Types.ObjectId, ref: "companies" },
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("clients", ClientSchema);