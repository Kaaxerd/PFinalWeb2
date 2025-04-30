const crypto = require('crypto');

const generateInvitationToken = () => {
    // Generate a 32-character hexadecimal token
    return crypto.randomBytes(16).toString('hex');
};

module.exports = { generateInvitationToken };