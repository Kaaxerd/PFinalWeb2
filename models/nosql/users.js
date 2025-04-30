const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: false
    },
    lastname: {
        type: String,
        required: false
    },
    nif: {
        type: String,
        required: false,
        unique: true,
        length: 9
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false
    },
    autonomous: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    },
    maxAttempts: {
        type: Number,
        default: 5
    },
    attemptsLeft: {
        type: Number,
        default: 5
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        select: false
    }
});

// Hook "pre" de mongoose para cifrar la contraseña antes de guardarla
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10); // Genera un salt con 10 rondas
            this.password = await bcrypt.hash(this.password, salt); // Cifra la contraseña
            next(); // Continúa con el guardado
        } catch (error) {
            next(error); // Si ocurre un error, pasa al siguiente middleware de manejo de errores
        }
    } else {
        next();
    }
});

userSchema.plugin(mongooseDelete, { overrideMethods: 'all' });
module.exports = mongoose.model('users', userSchema);