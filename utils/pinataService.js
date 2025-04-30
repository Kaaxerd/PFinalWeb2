const axios = require('axios');
const FormData = require('form-data');

const uploadToPinata = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            maxContentLength: Infinity,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY
            }
        });
        const ipfsHash = res.data.IpfsHash;
        return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
        console.log("Error uploading to Pinata:", error);
        return null;
    }
};

module.exports = { uploadToPinata };