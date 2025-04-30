const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        const db_uri = process.env.DB_URI;
        mongoose.set('strictQuery', false);
        await mongoose.connect(db_uri);
        console.log("Conectado a la BD");
    } catch (error) {
        console.error("No se ha podido establecer la conexión a la BD:", error);
        process.exit(1);
    }
};

module.exports = dbConnect;