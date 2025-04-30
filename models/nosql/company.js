const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        logo: { type: String },
        cif: { type: String, required: true, unique: true },
        street: { type: String, required: true },
        number: { type: Number, required: true },
        postal: { type: Number, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        invitationToken: { type: String, required: true, unique: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);