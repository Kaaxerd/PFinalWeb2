const multer = require('multer');

const storage = multer.memoryStorage(); // Usamos memoria para procesar el archivo

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // Limitar a 2 MB, por ejemplo
});

module.exports = upload;