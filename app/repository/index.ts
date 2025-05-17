import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function createAccount(userName : string , userEmail : string , userPassword : string){

    return await prisma.user.create({
        data:{
            userName,
            userEmail,
            userPassword
        },
        select:{
            userEmail : true,
            userName : true,
            id : true

        }
        
    })
}

async function loginUser( userEmail : string , userPassword : string){

    return await prisma.user.findUnique({
        where:{
            userEmail , 
            userPassword
        }
    })
}
async function isUserExist( userEmail : string ){

    return await prisma.user.findUnique({
        where:{
            userEmail 
        }
    })
}
async function uploadPhoto(photo : string , photoTitle : string , photoDesc : string , photoTags : string[] , userId : string ){

    return await prisma.photos.create({
        data:{
            photo , 
            photoTitle , 
            photoTags ,
            photoDesc,
            userId
        }
    })
}
async function addComment(userId : string , photoId : string , comment : string ){

    return await prisma.comments.create({
        data:{
           userId,
           photoId,
           comment
        }
    })
}

async function incrementPhotoLikesCount( photoId : string  ){

    return await prisma.photos.update({
        data:{
           likes : {increment : 1}
        },
        where:{
            id : photoId
        }
    })
}

async function addEntryToPhotoLikesTable(userId : string , photoId : string  ){

    return await prisma.photoLikes.create({
        data:{
           userId,
           photoId,
        }
    })
}

async function isPhotoLiked(userId : string , photoId : string  ){

    return await prisma.photoLikes.findUnique({
        where:{
           userId_photoId : {userId , photoId}
        }
    })
}

export {createAccount, loginUser , uploadPhoto , isUserExist , addComment , incrementPhotoLikesCount , addEntryToPhotoLikesTable , isPhotoLiked }