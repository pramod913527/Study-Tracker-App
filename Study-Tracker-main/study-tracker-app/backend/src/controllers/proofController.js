
const { v4: uuidv4 } = require('uuid');

// Proof controller: S3/GCS signed URL stub and metadata store
module.exports = (models) => ({
  uploadUrl: async (req, res) => {
    const { mime } = req.body;
    // Generate a fake signed URL (stub)
  const url = `https://fake-s3.com/bucket/${uuidv4()}`;
  const hash = uuidv4();
    // Store proof metadata
  const proof = await models.Proof.create({ url, hash, mime, uploadedBy: req.body.userId || null });
  res.json({ url, proof });
  }
});
