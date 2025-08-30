const functions = require("firebase-functions");
const admin = require("firebase-admin");
const BusBoy = require("busboy"); // For parsing multipart/form-data
const path = require("path");
const os = require("os");
const fs = require("fs");

admin.initializeApp();

exports.uploadProfilePhoto = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const busboy = BusBoy({ headers: req.headers });
  const tmpdir = os.tmpdir();
  const uploads = {};

  busboy.on("file", (fieldname, file, filename) => {
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", async () => {
    try {
      const bucket = admin.storage().bucket();
      const [field] = Object.keys(uploads);
      const localFile = uploads[field];
      const newFileName = `profilePhotos/${Date.now()}_${path.basename(localFile)}`;

      await bucket.upload(localFile, {
        destination: newFileName,
        metadata: {
          contentType: "image/jpeg", // or dynamic
        },
      });

      // Get the public URL
      const file = bucket.file(newFileName);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500", // Long expiration
      });

      fs.unlinkSync(localFile); // Remove temp file
      res.json({ url });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

  busboy.end(req.rawBody);
});
