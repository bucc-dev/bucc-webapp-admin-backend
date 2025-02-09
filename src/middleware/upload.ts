import multerS3 from "multer-s3";
import multer from "multer";
import { r2Client, validBuckets } from "../config/r2Config";
import { ErrorHandler } from "../utils/errorHandler";
import { checkUserPermission } from "../utils/checkPermission";
import { allPossibleResources } from "../config/roleConfig";

const s3Storage = multerS3({
  s3: r2Client,
  bucket: (req: any, file: Express.Multer.File, cb: (error: any, bucket?: string | undefined) => void) => {
    cb(null, req.body.bucketName);
  },
  acl: "private", // needs to be changed
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req: Express.Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
    const key = `${Date.now()}-${file.originalname}`;
    cb(null, key);
  },
});

function fileFilter(req: any, file: Express.Multer.File, cb: (error: any, acceptFile?: boolean) => void) {
  if (!req.body.bucketName || !validBuckets.includes(req.body.bucketName)) {
    return cb(new ErrorHandler(400, "A valid bucketName is required"));
  }

  if (!req.body.resource || !allPossibleResources.includes(req.body.resource)) {
    return cb(new ErrorHandler(400, "A valid resource is required"));
  }

  if (!(file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/"))) {
    return cb(new ErrorHandler(400, "Only image and video files are allowed"));
  }

  (async () => {
    try {
      await checkUserPermission(req.user, req.body.resource, "create");
      cb(null, true);
    } catch (error) {
      cb(error);
    }
  })();
};

export const upload = multer({ storage: s3Storage, fileFilter });