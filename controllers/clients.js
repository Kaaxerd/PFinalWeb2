const { clientsModel } = require("../models");
const { handleHttpError } = require("../utils/handleHttpError");

// Crear un nuevo cliente asociado al usuario o compañía
const createClientCtrl = async (req, res) => {
    try {
      const userId = req.user._id;
      const userCompany = req.user.company;
  
      const { name, nif, email, phone, address, postalCode, city, province } = req.body;
  
      // Comprobar si ya existe un cliente con ese NIF para ese usuario o su empresa
      const existingClient = await clientsModel.findOne({
        nif,
        $or: [
          { createdBy: userId },
          { company: userCompany }
        ]
      });
  
      if (existingClient) {
        return handleHttpError(res, "CLIENT_ALREADY_EXISTS", 409);
      }
  
      const newClient = await clientsModel.create({
        name,
        nif,
        email,
        phone,
        address,
        postalCode,
        city,
        province,
        createdBy: userId,
        company: userCompany
      });
  
      res.status(201).send(newClient);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_CREATING_CLIENT");
    }
};

// Actualizar un cliente existente
const updateClientCtrl = async (req, res) => {
    try {
      const clientId = req.params.id;
      const userId = req.user._id;
  
      const client = await clientsModel.findOne({
        _id: clientId,
        $or: [
          { createdBy: userId },
          { company: req.user.company }
        ]
      });
  
      if (!client) {
        return handleHttpError(res, "CLIENT_NOT_FOUND_OR_UNAUTHORIZED", 404);
      }
  
      // Actualiza los campos del cliente
      Object.assign(client, req.body);
      await client.save();
  
      res.send(client);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_UPDATING_CLIENT");
    }
};

const getClientsCtrl = async (req, res) => {
  try {
    const { _id: userId, company } = req.user;

    const clients = await clientsModel.find({
      archived: false,
      $or: [{ createdBy: userId }, { company }]
    });

    res.send(clients);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_GETTING_CLIENTS");
  }
};

const getClientByIdCtrl = async (req, res) => {
  try {
    const { _id: userId, company } = req.user;
    const clientId = req.params.id;

    const client = await clientsModel.findOne({
      _id: clientId,
      $or: [{ createdBy: userId }, { company }]
    });

    if (!client) {
      return handleHttpError(res, "CLIENT_NOT_FOUND", 404);
    }

    res.send(client);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_GETTING_CLIENT_BY_ID");
  }
};

const archiveClientCtrl = async (req, res) => {
  try {
    const { _id: userId, company } = req.user;
    const clientId = req.params.id;

    const client = await clientsModel.findOneAndUpdate(
      {
        _id: clientId,
        $or: [{ createdBy: userId }, { company }]
      },
      { archived: true },
      { new: true }
    );

    if (!client) {
      return handleHttpError(res, "CLIENT_NOT_FOUND", 404);
    }

    res.send({ message: "Cliente archivado", client });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_ARCHIVING_CLIENT");
  }
};

const deleteClientCtrl = async (req, res) => {
  try {
    const { _id: userId, company } = req.user;
    const clientId = req.params.id;

    const result = await clientsModel.deleteOne({
      _id: clientId,
      $or: [{ createdBy: userId }, { company }]
    });

    if (result.deletedCount === 0) {
      return handleHttpError(res, "CLIENT_NOT_FOUND", 404);
    }

    res.send({ message: "Cliente eliminado permanentemente" });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_DELETING_CLIENT");
  }
};

const getArchivedClientsCtrl = async (req, res) => {
  try {
    const { _id: userId, company } = req.user;

    const clients = await clientsModel.find({
      archived: true,
      $or: [{ createdBy: userId }, { company }]
    });

    res.send(clients);
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_GETTING_ARCHIVED_CLIENTS");
  }
};

const restoreClientCtrl = async (req, res) => {
  try {
    const { _id: userId, company } = req.user;
    const clientId = req.params.id;

    const client = await clientsModel.findOneAndUpdate(
      {
        _id: clientId,
        archived: true,
        $or: [{ createdBy: userId }, { company }]
      },
      { archived: false },
      { new: true }
    );

    if (!client) {
      return handleHttpError(res, "CLIENT_NOT_FOUND_OR_NOT_ARCHIVED", 404);
    }

    res.send({ message: "Cliente restaurado", client });
  } catch (err) {
    console.error(err);
    handleHttpError(res, "ERROR_RESTORING_CLIENT");
  }
};

module.exports = {
  createClientCtrl,
  updateClientCtrl,
  getClientsCtrl,
  getClientByIdCtrl,
  archiveClientCtrl,
  deleteClientCtrl,
  getArchivedClientsCtrl,
  restoreClientCtrl
};