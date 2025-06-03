"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.uploadSingleImageToS3 = uploadSingleImageToS3;
require("uuid");
const getenv_1 = require("../getenv");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg"];
    const fileExt = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExt)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."));
    }
};
const client_s3_1 = require("@aws-sdk/client-s3");
const sharp_1 = __importDefault(require("sharp"));
const accessKeyId = (0, getenv_1.getEnvVariables)().accessKeyId;
const secretAccessKey = (0, getenv_1.getEnvVariables)().secretAccessKey;
// Setup your AWS S3 client
const s3Client = new client_s3_1.S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});
function uploadSingleImageToS3(localFilePath, s3Key, bucketName) {
    return __awaiter(this, void 0, void 0, function* () {
        const compressImageByMimeRes = yield compressImageByMime(localFilePath);
        const uploadCommand = new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: s3Key,
            Body: compressImageByMimeRes.buffer,
            ContentType: compressImageByMimeRes.contentType,
        });
        yield s3Client.send(uploadCommand);
        console.log(`✅ Uploaded to S3: ${s3Key}`);
    });
}
function compressImageByMime(localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const mimeType = mime_types_1.default.lookup(localFilePath);
        const image = (0, sharp_1.default)(localFilePath).resize(800);
        let buffer;
        switch (mimeType) {
            case 'image/jpeg':
                buffer = yield image.jpeg({ quality: 50 }).toBuffer();
                break;
            case 'image/png':
                buffer = yield image.png({ quality: 50 }).toBuffer();
                break;
            case 'image/webp':
                buffer = yield image.webp({ quality: 50 }).toBuffer();
                break;
            case 'image/avif':
                buffer = yield image.avif({ quality: 50 }).toBuffer();
                break;
            case 'image/tiff':
                buffer = yield image.tiff({ quality: 50 }).toBuffer();
                break;
            case 'image/svg+xml':
                buffer = fs_1.default.createReadStream(localFilePath);
                break;
            default:
                throw new Error(`❌ Unsupported MIME type: ${mimeType}`);
        }
        return { buffer, contentType: mimeType };
    });
}
exports.upload = (0, multer_1.default)({ storage, fileFilter });
