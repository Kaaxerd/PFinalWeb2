const { deliveryNotesModel, projectsModel, usersModel, clientsModel } = require("../models");
const { handleHttpError } = require("../utils/handleHttpError");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { uploadFileToIPFS } = require("../utils/handleIPFS");
const axios = require("axios");

const createDeliveryNoteCtrl = async (req, res) => {
    try {
        const { type, people, materials, project } = req.body;
        const createdBy = req.user._id;
    
        if (!type || !["hours", "materials"].includes(type)) {
            return handleHttpError(res, "INVALID_DELIVERYNOTE_TYPE", 400);
        }
    
        const data = {
            project,
            type,
            createdBy,
            people: type === "hours" ? people : [],
            materials: type === "materials" ? materials : []
        };
    
        const newNote = await deliveryNotesModel.create(data);
        res.status(201).send(newNote);
    } catch (err) {
        console.error(err);
        handleHttpError(res, "ERROR_CREATING_DELIVERY_NOTE");
    }
};

const getAllDeliveryNotesCtrl = async (req, res) => {
    try {
      const { _id: userId, company } = req.user;
  
      // Buscar todos los proyectos del usuario o de su empresa
      const accessibleProjects = await projectsModel.find({
        $or: [{ user: userId }, { company }]
      }).select("_id");
  
      const projectIds = accessibleProjects.map(p => p._id);
  
      const notes = await deliveryNotesModel.find({
        project: { $in: projectIds },
        archived: false
      }).populate("project", "name")
        .populate("createdBy", "email");
  
      res.send(notes);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_GETTING_DELIVERY_NOTES");
    }
};

const getDeliveryNoteByIdCtrl = async (req, res) => {
    try {
      const noteId = req.params.id;
  
      const note = await deliveryNotesModel.findById(noteId)
        .populate({
          path: "project",
          populate: {
            path: "client",
            select: "name"
          },
          select: "name client"
        })
        .populate("createdBy", "email");
  
      if (!note) {
        return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);
      }
  
      res.send(note);
    } catch (err) {
      console.error(err);
      handleHttpError(res, "ERROR_GETTING_DELIVERY_NOTE_BY_ID");
    }
};

const getDeliveryNotePdfCtrl = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await deliveryNotesModel.findById(noteId)
            .populate("createdBy", "email")
            .populate({
                path: "project",
                populate: { path: "client", select: "name" },
                select: "name client"
            });

        if (!note) return handleHttpError(res, "DELIVERY_NOTE_NOT_FOUND", 404);

        const isOwner = note.createdBy._id.toString() === req.user._id;
        const isCompanyUser = note.project.company?.toString() === req.user.company;
        if (!isOwner && !isCompanyUser && req.user.role !== "guest") {
            return handleHttpError(res, "FORBIDDEN", 403);
        }

        // Si existe en la nube, redirigimos
        if (note.pdfUrl) {
            return res.send({ url: note.pdfUrl });
        }        

        // Si no, intentamos servir el PDF local
        const pdfPath = path.join(__dirname, `../tmp/albaran-${note._id}.pdf`);

        if (!fs.existsSync(pdfPath)) {
            return handleHttpError(res, "PDF_NOT_FOUND", 404);
        }

        res.setHeader("Content-Disposition", `attachment; filename=albaran_${note._id}.pdf`);
        res.setHeader("Content-Type", "application/pdf");

        const fileStream = fs.createReadStream(pdfPath);
        fileStream.pipe(res);
    } catch (err) {
        console.error(err);
        handleHttpError(res, "ERROR_GETTING_DELIVERY_NOTE_PDF");
    }
};

const signDeliveryNoteCtrl = async (req, res) => {
    try {
        const noteId = req.params.id;

        // Comprobar que se ha subido una firma
        if (!req.file) {
            return res.status(400).send("SIGNATURE_IMAGE_REQUIRED");
        }

        const deliveryNote = await deliveryNotesModel.findById(noteId);
        if (!deliveryNote) {
            return res.status(404).send("DELIVERY_NOTE_NOT_FOUND");
        }

        // Verificar que el usuario puede firmar este albarán
        const userId = req.user._id.toString();
        const isOwner = deliveryNote.createdBy.toString() === userId;
        const isGuest = req.user.role === "guest" && deliveryNote.createdBy.toString() === userId;

        if (!isOwner && !isGuest) {
            return res.status(403).send("FORBIDDEN");
        }

        // Marcar como firmado
        deliveryNote.signed = true;

        // Paths
        const signaturePath = req.file.path;
        const fileName = `albaran-${noteId}.pdf`;
        const filePath = path.join(__dirname, "../tmp", fileName);

        // Obtener datos relacionados
        const user = await usersModel.findById(deliveryNote.createdBy);
        const project = await projectsModel.findById(deliveryNote.project);
        const client = await clientsModel.findById(project.client);

        // Generar PDF
        await generatePDF(deliveryNote, user, client, project, signaturePath, filePath);

        // Subir a IPFS
        const ipfsHash = await uploadFileToIPFS(filePath);
        deliveryNote.pdfUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        // Guardar y limpiar
        await deliveryNote.save();
        fs.unlinkSync(filePath);

        return res.send({ message: "Albarán firmado", url: deliveryNote.pdfUrl });
    } catch (error) {
        console.error("ERROR_SIGNING_DELIVERY_NOTE", error);
        return res.status(403).send("ERROR_SIGNING_DELIVERY_NOTE");
    }
};

const generatePDF = async (note, user, client, project, signaturePath, outputPath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        doc.fontSize(18).text("Albarán", { align: "center" }).moveDown();
        doc.fontSize(12).text(`Proyecto: ${project?.name}`);
        doc.text(`Cliente: ${client?.name}`);
        doc.text(`Usuario: ${user?.email}`);
        doc.text(`Tipo: ${note?.type}`);
        doc.moveDown();

        if (note.type === "hours") {
            doc.text("Personas:");
            note.people.forEach(p => {
                doc.text(`- ${p.name}: ${p.hours} horas`);
            });
        } else if (note.type === "materials") {
            doc.text("Materiales:");
            note.materials.forEach(m => {
                doc.text(`- ${m.name}: ${m.quantity}`);
            });
        }

        if (fs.existsSync(signaturePath)) {
            doc.addPage().text("Firma:", { align: "left" });
            doc.image(signaturePath, { fit: [300, 150], align: "center" });
        }

        doc.end();
        stream.on("finish", resolve);
        stream.on("error", reject);
    });
};

const deleteDeliveryNoteCtrl = async (req, res) => {
    try {
        const noteId = req.params.id;

        const deliveryNote = await deliveryNotesModel.findById(noteId);
        if (!deliveryNote) {
            return res.status(404).send("DELIVERY_NOTE_NOT_FOUND");
        }

        if (deliveryNote.signed) {
            return res.status(403).send("CANNOT_DELETE_SIGNED_NOTE");
        }

        await deliveryNotesModel.deleteOne({ _id: noteId });
        return res.send({ message: "DELIVERY_NOTE_DELETED" });
    } catch (error) {
        console.error("ERROR_DELETING_DELIVERY_NOTE", error);
        return res.status(500).send("ERROR_DELETING_DELIVERY_NOTE");
    }
};
  
module.exports = { createDeliveryNoteCtrl, getAllDeliveryNotesCtrl, getDeliveryNoteByIdCtrl, getDeliveryNotePdfCtrl, signDeliveryNoteCtrl, deleteDeliveryNoteCtrl };