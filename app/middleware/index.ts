import {  Response , Request , NextFunction  } from "express";
import { CustomError  } from "../util";
import { json } from "stream/consumers";
import { defaultRes , PathDosentExistError } from "../util";
import  jwt  from "jsonwebtoken";
import { getEnvVariables } from "../../getenv";

const SECRET_KEY = getEnvVariables().SECRET_KEY as string

function defaultErr(err : any ,  req : Request , res : Response  , next :NextFunction ){
console.log("🚀 ~ defaultErr ~ err:", err)

    if (err instanceof CustomError || err instanceof PathDosentExistError) {
      
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

  
function checkAuth(req : Request  , res : Response , next : NextFunction){
    const authHeader = req?.headers?.authorization
   
    const token = authHeader?.split(" ")?.[1] as string

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new CustomError("unauthorized, pls enter valid token" , 400)
    }
  
    try{
        const jwtPayload = jwt.verify(token , SECRET_KEY)  
        req.body.user = jwtPayload 
    }
    catch(error){
        throw new CustomError("invalid Token" , 400)
    }  
    
    next()
}


function wrongPath(  req : Request , res : Response  , next :NextFunction ){
    
    if (!res.headersSent) {

        const error = new PathDosentExistError('path does no exist , go home' , 404)
         
        next(error); // Pass the error to the error handler
    } else {
        next(); // Continue without modifying the response
    }
}


export {defaultErr , checkAuth , wrongPath}