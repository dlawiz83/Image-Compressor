const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/compress", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = `compressed-${Date.now()}.jpg`;

    // Compress image
    await sharp(inputPath)
      .resize({ width: 800 }) // Resize width to 800px
      .jpeg({ quality: 60 }) // 60% quality
      .toFile(outputPath);

    // Delete original uploaded file
    fs.unlinkSync(inputPath);

    res.download(outputPath, () => {
      fs.unlinkSync(outputPath); // delete after download
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Compression failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
