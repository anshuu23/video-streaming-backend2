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
exports.checkValidation = void 0;
exports.hashPassword = hashPassword;
exports.unHashPassword = unHashPassword;
const { validationResult } = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const util_1 = require("../util");
// Check Validation For Requests
const checkValidation = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // const validationError = {
        //   message: errors.errors,
        // };
        // throw validationError;
        throw new util_1.CustomError(errors.errors, 400);
    }
};
exports.checkValidation = checkValidation;
function hashPassword(plainPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(plainPassword, 10);
    });
}
function unHashPassword(plainPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainPassword, hashedPassword);
    });
}
