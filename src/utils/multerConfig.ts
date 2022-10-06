import { S3Client } from "@aws-sdk/client-s3";
import { randomBytes } from "crypto";
import multer, { diskStorage } from "multer";
import multerS3 from "multer-s3";
import path from "path";

const UPLOAD_PATH = path.resolve(__dirname, "../../public/uploads");

const localDiskStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    // garantir que os nomes não se sobreponham
    // usa-se um hash
    randomBytes(16, (err, hash) => {
      console.log({
        IS_S3_STORAGE: process.env.IS_S3_STORAGE,
      });

      if (err) throw err;

      const filename = `${hash.toString("hex")}-${file.originalname}`;

      cb(null, filename);
    });
  },
});

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
});

const s3Storage = multerS3({
  s3: s3,
  bucket: "endoh",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: "public-read", // permissão
  key: (req, file, cb) => {
    // garantir que os nomes não se sobreponham
    // usa-se um hash
    randomBytes(16, (err, hash) => {
      if (err) throw err;

      const fileName = `${hash.toString("hex")}-${file.originalname}`;

      cb(null, fileName);
    });
  },
});

export const multerConfig: multer.Options = {
  storage: process.env.IS_S3_STORAGE === "true" ? s3Storage : localDiskStorage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
};
