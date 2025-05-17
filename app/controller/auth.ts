import { Request , Response , NextFunction } from "express";
import { defaultRes } from "../util";
import { checkValidation , hashPassword, unHashPassword } from "../helper";
import { createAccount, loginUser , uploadPhoto , isUserExist , addComment ,  incrementPhotoLikesCount , addEntryToPhotoLikesTable , isPhotoLiked} from "../repository";
import { defaultErr } from "../middleware";
import { CustomError  } from "../util";
import jwt from "jsonwebtoken"
import { getEnvVariables } from "../../getenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
const SECRET_KEY = getEnvVariables().SECRET_KEY  as string

console.log(SECRET_KEY)


async function HandelCreateUserAccount(req : Request , res : Response , next : NextFunction){

    try{

        checkValidation(req)

        const { userName, userEmail, userPassword }: { userName: string, userEmail: string, userPassword: string } = req.body;

        const isUserExistRes = await isUserExist(userEmail)
       
        if(isUserExistRes){
            throw new CustomError("user with this email already exist" , 409)
        }
        const hashedPassword = await hashPassword(userPassword)

        const createAccountRes = await createAccount(userName , userEmail , hashedPassword)
        
        const dataTOMakeToken = {
            userId : createAccountRes.id,
            userName : createAccountRes.userName
        } 
        const tokenToSend = jwt.sign( dataTOMakeToken , SECRET_KEY ,{expiresIn : '10m'})

        defaultRes(res , 200 , "account created successfully" , tokenToSend)       
        
    }
    catch(error){
        console.log(error)
        next(error)
    }
    
}


async function HandelUserLogin(req : Request , res : Response , next : NextFunction){

    try{

        checkValidation(req)

        const {userEmail, userPassword }: {  userEmail: string, userPassword: string } = req.body;

        const isUserExistRes = await isUserExist(userEmail)

        if(!isUserExistRes){
            throw new CustomError("account with this email dosent exist" , 400)
        }

        const plainPassword = userPassword ;
        const hashedPassword = isUserExistRes.userPassword;

        const isPasswordCorrect = await unHashPassword(plainPassword , hashedPassword)

        if(!isPasswordCorrect){
            throw new CustomError("wrong password" , 400)
        }

        const dataTOMakeToken = {
            userId : isUserExistRes.id,
            userName : isUserExistRes.userName
        } 
        const tokenToSend = jwt.sign( dataTOMakeToken , SECRET_KEY ,{expiresIn : '10m'})

        defaultRes(res , 200 , "account logged in , token generated" , tokenToSend)

        
    }
    catch(error){
        console.log(error)
        next(error)
    }
    
}


async function HandelUploadPhoto(req : Request , res : Response , next : NextFunction){

    try{

        checkValidation(req)
        const {photo , photoTitle , photoDesc , photoTags } : {photo:string , photoTitle:string ,  photoDesc:string ,  photoTags:string [] } = req.body
        const userId : string = req.body.user.userId
       
        const uploadPhotoRes = await uploadPhoto(photo , photoTitle , photoDesc , photoTags , userId )
       
        defaultRes(res , 200 , "photo uploaded successfully" , uploadPhotoRes)
        
    }
    catch(error){
        console.log(error)
        next(error)
    }
    
}
async function HandelAddComment(req : Request , res : Response , next : NextFunction){

    try{

        checkValidation(req)
        const {photoId , comment} : {photoId:string , comment:string } = req.body
        const userId : string = req.body.user.userId
       
        const addCommentRes = await addComment( userId , photoId , comment )

        console.log("addCommentRes------" , addCommentRes)
       
        defaultRes(res , 200 , "comment added successfully" , addCommentRes)
        
    }
    catch(error){
        console.log(error)
        next(error)
    }
    
}


async function HandelPhotoLike(req : Request , res : Response , next : NextFunction){

    try{

        checkValidation(req)
        const {photoId } : {photoId:string } = req.body
        const userId : string = req.body.user.userId

        const isPhotoLikedRes = await isPhotoLiked(userId , photoId)

        console.log("------------isPhotoLikedRes" ,isPhotoLikedRes)
        if(isPhotoLikedRes){
            throw new CustomError("u have already liked photo" , 400)
        }
        const entryToLikesTable = await  addEntryToPhotoLikesTable(userId , photoId)
        const didPhotoLikesIncremeted = await incrementPhotoLikesCount(photoId)

        console.log('didPhotoLikesIncremeted------------' , didPhotoLikesIncremeted)
        console.log('entryToLikesTable------------' , entryToLikesTable)
        
        defaultRes(res , 200 , "photo liked successfully" , '👍👍👍👍👍')
        
    }
    catch(error:any){
        console.log(error, "trweriwueruiweruiwe")
        next(error)
    }
    
}
async function isTokenVerifyied(req : Request , res : Response , next : NextFunction){

    try{

        const tokenTocheck : string = req.body.token
    
        if(!tokenTocheck){
            throw new CustomError("pls send token" , 400)
        }
        const isTokenValid = jwt.verify(tokenTocheck , SECRET_KEY)
        
        if(isTokenValid){
            defaultRes(res , 200 , "token is valid" , '👍👍👍👍👍')
        }
       
        
    }
    catch(error:any){
        next(error)
    }
    
}

export {HandelCreateUserAccount , HandelUserLogin , HandelUploadPhoto , HandelAddComment , HandelPhotoLike , isTokenVerifyied}