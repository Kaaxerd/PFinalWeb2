const mongoose = require("mongoose");

const PersonEntrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    hours: { type: Number, required: true }
}, { _id: false });

const MaterialEntrySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true }
}, { _id: false });

const DeliveryNoteSchema = new mongoose.Schema({
    project: { type: mongoose.Types.ObjectId, ref: "projects", required: true },
    type: { type: String, enum: ["hours", "materials"], required: true },
    people: [PersonEntrySchema],      // para albarán de horas
    materials: [MaterialEntrySchema], // para albarán de materiales
    createdBy: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    signed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    signatureUrl: { type: String },
    pdfUrl: { type: String }
}, {
    timestamps: true,
    versionKey: false
});
  
module.exports = mongoose.model("deliverynotes", DeliveryNoteSchema);