const jwt = require('jsonwebtoken');
const { usersModel } = require("../models");

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporcionó un token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token mal formado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usersModel.findById(decoded._id).select("_id company role");

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        req.user = {
            _id: user._id,
            company: user.company,
            role: user.role
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = requireAuth;
