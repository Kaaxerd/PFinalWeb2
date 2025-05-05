const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_JWT = process.env.PINATA_JWT;

const uploadFileToIPFS = async (filePath) => {
  const data = new FormData();
  data.append("file", fs.createReadStream(filePath));

  try {
    const res = await axios.post(PINATA_URL, data, {
      headers: {
        ...data.getHeaders(),
        Authorization: `Bearer ${process.env.PINATA_JWT}`
      }
    });

    return res.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error.response?.data || error.message);
    throw new Error("UPLOAD_TO_PINATA_FAILED");
  }
};

module.exports = { uploadFileToIPFS };