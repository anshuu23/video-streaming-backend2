"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getenv_1 = require("./getenv");
const routes_1 = __importDefault(require("./routes"));
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/', routes_1.default);
routes_1.default.use(middleware_1.wrongPath);
routes_1.default.use(middleware_1.defaultErr);
const PORT = (0, getenv_1.getEnvVariables)().PORT;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
