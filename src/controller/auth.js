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
exports.HandelCreateUserAccount = HandelCreateUserAccount;
exports.HandelUserLogin = HandelUserLogin;
exports.HandelUploadPhoto = HandelUploadPhoto;
exports.HandelAddComment = HandelAddComment;
exports.HandelPhotoLike = HandelPhotoLike;
exports.isTokenVerifyied = isTokenVerifyied;
const util_1 = require("../util");
const helper_1 = require("../helper");
const repository_1 = require("../repository");
const util_2 = require("../util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getenv_1 = require("../../getenv");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const SECRET_KEY = (0, getenv_1.getEnvVariables)().SECRET_KEY;
console.log(SECRET_KEY);
function HandelCreateUserAccount(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, helper_1.checkValidation)(req);
            const { userName, userEmail, userPassword } = req.body;
            const isUserExistRes = yield (0, repository_1.isUserExist)(userEmail);
            if (isUserExistRes) {
                throw new util_2.CustomError("user with this email already exist", 409);
            }
            const hashedPassword = yield (0, helper_1.hashPassword)(userPassword);
            const createAccountRes = yield (0, repository_1.createAccount)(userName, userEmail, hashedPassword);
            const dataTOMakeToken = {
                userId: createAccountRes.id,
                userName: createAccountRes.userName
            };
            const tokenToSend = jsonwebtoken_1.default.sign(dataTOMakeToken, SECRET_KEY, { expiresIn: '10m' });
            (0, util_1.defaultRes)(res, 200, "account created successfully", tokenToSend);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
function HandelUserLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, helper_1.checkValidation)(req);
            const { userEmail, userPassword } = req.body;
            const isUserExistRes = yield (0, repository_1.isUserExist)(userEmail);
            if (!isUserExistRes) {
                throw new util_2.CustomError("account with this email dosent exist", 400);
            }
            const plainPassword = userPassword;
            const hashedPassword = isUserExistRes.userPassword;
            const isPasswordCorrect = yield (0, helper_1.unHashPassword)(plainPassword, hashedPassword);
            if (!isPasswordCorrect) {
                throw new util_2.CustomError("wrong password", 400);
            }
            const dataTOMakeToken = {
                userId: isUserExistRes.id,
                userName: isUserExistRes.userName
            };
            const tokenToSend = jsonwebtoken_1.default.sign(dataTOMakeToken, SECRET_KEY, { expiresIn: '1h' });
            (0, util_1.defaultRes)(res, 200, "account logged in , token generated", tokenToSend);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
function HandelUploadPhoto(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, helper_1.checkValidation)(req);
            const { photo, photoTitle, photoDesc, photoTags } = req.body;
            const userId = req.body.user.userId;
            const uploadPhotoRes = yield (0, repository_1.uploadPhoto)(photo, photoTitle, photoDesc, photoTags, userId);
            (0, util_1.defaultRes)(res, 200, "photo uploaded successfully", uploadPhotoRes);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
function HandelAddComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, helper_1.checkValidation)(req);
            const { photoId, comment } = req.body;
            const userId = req.body.user.userId;
            const addCommentRes = yield (0, repository_1.addComment)(userId, photoId, comment);
            console.log("addCommentRes------", addCommentRes);
            (0, util_1.defaultRes)(res, 200, "comment added successfully", addCommentRes);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
function HandelPhotoLike(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, helper_1.checkValidation)(req);
            const { photoId } = req.body;
            const userId = req.body.user.userId;
            const isPhotoLikedRes = yield (0, repository_1.isPhotoLiked)(userId, photoId);
            console.log("------------isPhotoLikedRes", isPhotoLikedRes);
            if (isPhotoLikedRes) {
                throw new util_2.CustomError("u have already liked photo", 400);
            }
            const entryToLikesTable = yield (0, repository_1.addEntryToPhotoLikesTable)(userId, photoId);
            const didPhotoLikesIncremeted = yield (0, repository_1.incrementPhotoLikesCount)(photoId);
            console.log('didPhotoLikesIncremeted------------', didPhotoLikesIncremeted);
            console.log('entryToLikesTable------------', entryToLikesTable);
            (0, util_1.defaultRes)(res, 200, "photo liked successfully", '👍👍👍👍👍');
        }
        catch (error) {
            console.log(error, "trweriwueruiweruiwe");
            next(error);
        }
    });
}
function isTokenVerifyied(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tokenTocheck = req.body.token;
            if (!tokenTocheck) {
                throw new util_2.CustomError("pls send token", 400);
            }
            const isTokenValid = jsonwebtoken_1.default.verify(tokenTocheck, SECRET_KEY);
            if (isTokenValid) {
                (0, util_1.defaultRes)(res, 200, "token is valid", '👍👍👍👍👍');
            }
        }
        catch (error) {
            next(error);
        }
    });
}
