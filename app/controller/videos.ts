import { Request , Response , NextFunction } from "express";
import { getAllVideos, getSearchedVideos } from "../repository"
import { defaultRes } from "../util"

async function HandleGetAllVideos(req : Request , res : Response , next : NextFunction){

    try{

        const getAllVideosRes = await getAllVideos()

        defaultRes(res , 200 , "data retrived successfully" , getAllVideosRes)       
        
    }
    catch(error){
        console.log(error)
        next(error)
    }
    
}

async function HandleGetSearchedVideos(req : Request , res : Response , next : NextFunction){

    try{
        const {query} = req.params
        const getAllVideosRes = await getSearchedVideos(query)

        defaultRes(res , 200 , "data retrived successfully" , getAllVideosRes)       
        
    }
    catch(error){
        console.log(error)
        next(error)
    }
    
}

export {HandleGetAllVideos , HandleGetSearchedVideos}
