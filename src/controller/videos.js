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
exports.HandleGetAllVideos = HandleGetAllVideos;
exports.HandleGetSearchedVideos = HandleGetSearchedVideos;
const repository_1 = require("../repository");
const util_1 = require("../util");
function HandleGetAllVideos(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getAllVideosRes = yield (0, repository_1.getAllVideos)();
            (0, util_1.defaultRes)(res, 200, "data retrived successfully", getAllVideosRes);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
function HandleGetSearchedVideos(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { query } = req.params;
            const getAllVideosRes = yield (0, repository_1.getSearchedVideos)(query);
            (0, util_1.defaultRes)(res, 200, "data retrived successfully", getAllVideosRes);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    });
}
