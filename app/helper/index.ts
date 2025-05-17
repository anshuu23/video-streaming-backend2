const { validationResult } = require("express-validator");
import bcrypt from "bcrypt"
import { CustomError } from "../util";

//import {validationResult} from "express-validator"
import { Request } from "express";
// Check Validation For Requests


 const checkValidation = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // const validationError = {
    //   message: errors.errors,
    // };
    // throw validationError;
    throw new CustomError(errors.errors , 400)
  }
};

async function hashPassword(plainPassword : string){
 return await bcrypt.hash(plainPassword , 10)
}

async function unHashPassword(plainPassword : string , hashedPassword : string){
 return await bcrypt.compare(plainPassword , hashedPassword)
}

export  {checkValidation , hashPassword , unHashPassword}
