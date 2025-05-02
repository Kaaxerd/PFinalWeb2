const { projectsModel } = require("../models");
const { handleHttpError } = require("../utils/handleHttpError");

const createProjectCtrl = async (req, res) => {
    try {
      const userId = req.user._id;
      const { name, description, client } = req.body;
  
      const project = await projectsModel.create({
        name,
        description,
        user: userId,
        client
      });
  
      res.status(201).send(project);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_CREATING_PROJECT");
    }
};

const updateProjectCtrl = async (req, res) => {
    try {
      const userId = req.user._id;
      const projectId = req.params.id;
  
      const project = await projectsModel.findOne({
        _id: projectId,
        user: userId
      });
  
      if (!project) {
        return handleHttpError(res, "PROJECT_NOT_FOUND", 404);
      }
  
      Object.assign(project, req.body);
      await project.save();
  
      res.send(project);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_UPDATING_PROJECT");
    }
};

const getAllProjectsCtrl = async (req, res) => {
    try {
      const { _id: userId, company } = req.user;
  
      const projects = await projectsModel.find({
        archived: false,
        $or: [{ user: userId }, { company }]
      }).populate("client", "name").populate("user", "email");
  
      res.send(projects);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_GETTING_PROJECTS");
    }
};

const getProjectByIdCtrl = async (req, res) => {
    try {
      const { _id: userId, company } = req.user;
      const projectId = req.params.id;
  
      const project = await projectsModel.findOne({
        _id: projectId,
        $or: [{ user: userId }, { company }]
      }).populate("client", "name").populate("user", "email");
  
      if (!project) {
        return handleHttpError(res, "PROJECT_NOT_FOUND", 404);
      }
  
      res.send(project);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_GETTING_PROJECT_BY_ID");
    }
};

const archiveProjectCtrl = async (req, res) => {
    try {
      const { _id: userId, company } = req.user;
      const projectId = req.params.id;
  
      const project = await projectsModel.findOneAndUpdate(
        {
          _id: projectId,
          $or: [{ user: userId }, { company }]
        },
        { archived: true },
        { new: true }
      );
  
      if (!project) {
        return handleHttpError(res, "PROJECT_NOT_FOUND", 404);
      }
  
      res.send({ message: "Proyecto archivado", project });
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_ARCHIVING_PROJECT");
    }
};
  
const deleteProjectCtrl = async (req, res) => {
    try {
      const { _id: userId, company } = req.user;
      const projectId = req.params.id;
  
      const result = await projectsModel.deleteOne({
        _id: projectId,
        $or: [{ user: userId }, { company }]
      });
  
      if (result.deletedCount === 0) {
        return handleHttpError(res, "PROJECT_NOT_FOUND", 404);
      }
  
      res.send({ message: "Proyecto eliminado permanentemente" });
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_DELETING_PROJECT");
    }
};

const getArchivedProjectsCtrl = async (req, res) => {
    try {
      const { _id: userId, company } = req.user;
  
      const projects = await projectsModel.find({
        archived: true,
        $or: [{ user: userId }, { company }]
      }).populate("client", "name");
  
      res.send(projects);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_GETTING_ARCHIVED_PROJECTS");
    }
};
  
const restoreProjectCtrl = async (req, res) => {
    try {
      const { _id: userId, company } = req.user;
      const projectId = req.params.id;
  
      const project = await projectsModel.findOneAndUpdate(
        {
          _id: projectId,
          archived: true,
          $or: [{ user: userId }, { company }]
        },
        { archived: false },
        { new: true }
      );
  
      if (!project) {
        return handleHttpError(res, "PROJECT_NOT_FOUND_OR_NOT_ARCHIVED", 404);
      }
  
      res.send({ message: "Proyecto restaurado", project });
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_RESTORING_PROJECT");
    }
};

module.exports = {
    createProjectCtrl,
    updateProjectCtrl,
    getAllProjectsCtrl,
    getProjectByIdCtrl,
    archiveProjectCtrl,
    deleteProjectCtrl,
    getArchivedProjectsCtrl,
    restoreProjectCtrl
};  