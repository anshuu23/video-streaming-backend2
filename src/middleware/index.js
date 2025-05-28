"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultErr = defaultErr;
exports.checkAuth = checkAuth;
exports.wrongPath = wrongPath;
const util_1 = require("../util");
const util_2 = require("../util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getenv_1 = require("../../getenv");
const SECRET_KEY = (0, getenv_1.getEnvVariables)().SECRET_KEY;
function defaultErr(err, req, res, next) {
    console.log("🚀 ~ defaultErr ~ err:", err);
    if (err instanceof util_1.CustomError || err instanceof util_2.PathDosentExistError) {
        res.status(err.statusCode).json({
            msg: err.message,
            error: err
        });
    }
    else {
        res.status(500).json({
            msg: 'An unexpected error occurred.',
            error: 'Internal Server Error'
        });
    }
    // console.log("err came in default err fun" , err)
    // res.status(401).json({ error : err })
}
function checkAuth(req, res, next) {
    var _a, _b;
    const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    const token = (_b = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")) === null || _b === void 0 ? void 0 : _b[1];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new util_1.CustomError("unauthorized, pls enter valid token", 400);
    }
    try {
        const jwtPayload = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        const authReq = req;
        authReq.user = jwtPayload;
    }
    catch (error) {
        throw new util_1.CustomError("invalid Token", 400);
    }
    next();
}
function wrongPath(req, res, next) {
    if (!res.headersSent) {
        const error = new util_2.PathDosentExistError('path does no exist , go home', 404);
        next(error); // Pass the error to the error handler
    }
    else {
        next(); // Continue without modifying the response
    }
}
