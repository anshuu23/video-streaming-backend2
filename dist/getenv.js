"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVariables = getEnvVariables;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnvVariables() {
    const PORT = process.env.PORT;
    const SECRET_KEY = process.env.SECRET_KEY;
    const secretAccessKey = process.env.secretAccessKey;
    const accessKeyId = process.env.accessKeyId;
    return {
        PORT, SECRET_KEY, secretAccessKey, accessKeyId
    };
}
