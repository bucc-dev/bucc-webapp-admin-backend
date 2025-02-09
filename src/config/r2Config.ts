import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer, { Multer } from "multer";
import dotenv from "dotenv";

import { ErrorHandler } from "../utils/errorHandler";

dotenv.config();

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  throw new ErrorHandler(500, "Missing Cloudflare R2 credentials in environment variables.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});



const s3Storage = multerS3({
  s3: r2Client,
  bucket: (req: any, file: Express.Multer.File, cb: (error: any, bucket?: string | undefined) => void) => {
    const bucketName = req.body.bucketName;
    if (!bucketName) {
      return cb(new ErrorHandler(400, "Bucket name not provided"), undefined);
    }
    cb(null, bucketName);
  },
  acl: "public-read", // Files are private; they require signed URLs for access.
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req: Express.Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
    const key = `${Date.now()}-${file.originalname}`;
    cb(null, key);
  },
});

export const upload = multer({ storage: s3Storage });


export async function getSignedUrlForFile(bucketName: 'announcementmedia', key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 86400 }); // 24 hours
}