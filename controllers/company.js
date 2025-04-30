const Company = require('../models/nosql/company');
const usersModel = require('../models/nosql/users');
const { handleHttpError } = require('../utils/handleHttpError');
const { uploadToPinata } = require('../utils/pinataService');
const { generateInvitationToken } = require('../utils/handleInvitationToken');

const createCompanyCtrl = async (req, res) => {
    try {
        const companyData = req.body;
        const invitationToken = generateInvitationToken(); // Genera el token de invitación
        const companyDataWithToken = { ...companyData, invitationToken }; // Agrega el token al objeto de la compañía
        
        const newCompany = await Company.create(companyDataWithToken);
        res.status(201).send(newCompany);
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_CREATE_COMPANY");
    }
};

const updateCompanyCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Si se sube un archivo se sube a Pinata
        if (req.file) {
            const pinataUrl = await uploadToPinata(req.file);
            if (!pinataUrl) {
                return res.status(500).json({ message: 'Error al subir el logo a Pinata' });
            }
            updateData.logo = pinataUrl; // Asignamos la URL del logo a updateData
        }

        const updatedCompany = await Company.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
        if (!updatedCompany) {
            return handleHttpError(res, "COMPANY_NOT_FOUND", 404);
        }
        
        res.send(updatedCompany);
    } catch (err) {
        console.log(err);
        handleHttpError(res, "ERROR_UPDATE_COMPANY");
    }
};

module.exports = { createCompanyCtrl, updateCompanyCtrl };