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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = createAccount;
exports.loginUser = loginUser;
exports.uploadPhoto = uploadPhoto;
exports.isUserExist = isUserExist;
exports.addComment = addComment;
exports.incrementPhotoLikesCount = incrementPhotoLikesCount;
exports.addEntryToPhotoLikesTable = addEntryToPhotoLikesTable;
exports.isPhotoLiked = isPhotoLiked;
exports.uploadVideoDetails = uploadVideoDetails;
exports.getAllVideos = getAllVideos;
exports.getSearchedVideos = getSearchedVideos;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createAccount(userName, userEmail, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.create({
            data: {
                userName,
                userEmail,
                userPassword
            },
            select: {
                userEmail: true,
                userName: true,
                id: true
            }
        });
    });
}
function loginUser(userEmail, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.findUnique({
            where: {
                userEmail,
                userPassword
            }
        });
    });
}
function isUserExist(userEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.user.findUnique({
            where: {
                userEmail
            }
        });
    });
}
function uploadPhoto(photo, photoTitle, photoDesc, photoTags, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.photos.create({
            data: {
                photo,
                photoTitle,
                photoTags,
                photoDesc,
                userId
            }
        });
    });
}
function addComment(userId, photoId, comment) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.comments.create({
            data: {
                userId,
                photoId,
                comment
            }
        });
    });
}
function incrementPhotoLikesCount(photoId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.photos.update({
            data: {
                likes: { increment: 1 }
            },
            where: {
                id: photoId
            }
        });
    });
}
function addEntryToPhotoLikesTable(userId, photoId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.photoLikes.create({
            data: {
                userId,
                photoId,
            }
        });
    });
}
function isPhotoLiked(userId, photoId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.photoLikes.findUnique({
            where: {
                userId_photoId: { userId, photoId }
            }
        });
    });
}
function uploadVideoDetails(id, userId, title, description, tags, visibility, categories, userName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.video.create({
            data: {
                id,
                userId,
                title,
                description,
                tags,
                visibility,
                categories,
                userName
            }
        });
    });
}
function getAllVideos() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.video.findMany({});
    });
}
function getSearchedVideos(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma.video.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        userName: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        categories: {
                            hasSome: [query.toLowerCase()]
                        }
                    },
                    {
                        tags: {
                            hasSome: [query.toLowerCase()]
                        }
                    }
                ]
            }
        });
    });
}
