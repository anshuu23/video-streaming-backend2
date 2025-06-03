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
exports.GenerateSignedUrl = GenerateSignedUrl;
exports.HandeluplodVideoDetails = HandeluplodVideoDetails;
require("uuid");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const util_1 = require("../util");
const crypto_1 = require("crypto");
const getenv_1 = require("../getenv");
const repository_1 = require("../repository");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const services_1 = require("../services");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileExt = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExt)) {
        cb(null, true);
    }
    else {
        cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."));
    }
};
const upload = (0, multer_1.default)({ storage, fileFilter });
function HandeluplodVideoDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const accessKeyId = (0, getenv_1.getEnvVariables)().accessKeyId;
            const secretAccessKey = (0, getenv_1.getEnvVariables)().secretAccessKey;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            const userName = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userName;
            console.log('ttttt', userId);
            const { title, description, categories, tags, visibility, } = req.body;
            const token = req.body.token;
            const categoriess = JSON.parse(categories);
            const uid = (0, crypto_1.randomUUID)();
            const tagsArr = tags.split(",");
            const thumbnailPath = path_1.default.join(__dirname, '..', '..', 'uploads', (_c = req.file) === null || _c === void 0 ? void 0 : _c.filename);
            yield (0, services_1.uploadSingleImageToS3)(thumbnailPath, "thumbnail/" + uid, "final-video-upload");
            const url = yield GenerateSignedUrl(uid);
            //
            // 
            const uploadVideoDetailsRes = yield (0, repository_1.uploadVideoDetails)(uid, userId, title, description, tagsArr, visibility, categoriess, userName);
            (0, util_1.defaultRes)(res, 200, 'data added successfully', [url, uid]);
        }
        catch (error) {
            console.log(error, "trweriwueruiweruiwe");
            next(error);
        }
    });
}
function GenerateSignedUrl(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessKeyId = (0, getenv_1.getEnvVariables)().accessKeyId;
        const secretAccessKey = (0, getenv_1.getEnvVariables)().secretAccessKey;
        aws_sdk_1.default.config.update({ accessKeyId, secretAccessKey, region: 'ap-south-1' });
        const uid = id + '.mp4';
        const s3 = new aws_sdk_1.default.S3();
        const myBucket = 'video-storage-signed-url2';
        const myKey = uid;
        const signedUrlExpireSeconds = 60 * 5;
        return s3.getSignedUrl('putObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
        });
    });
}
function useEffect() {
    throw new Error("Function not implemented.");
}
