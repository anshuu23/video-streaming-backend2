import express from "express";
import { validateCreateAccountReq , validateUserLoginReq ,validateUploadPhoto , validateComment , validateLike} from "../util";


const router = express.Router()
import { AuthController, UploadsController, VideosController } from "../controller";
import { checkAuth, defaultErr, wrongPath } from "../middleware";
import { upload } from "../services";


router.post('/createAccount' , validateCreateAccountReq , AuthController.HandelCreateUserAccount)

router.post('/loginUser' , validateUserLoginReq, AuthController.HandelUserLogin)

router.post('/video-details' ,checkAuth , upload.single("thumbnail") ,  UploadsController.HandeluplodVideoDetails)

router.get('/getVideos'  , VideosController.HandleGetAllVideos)

router.get('/search/:query' , VideosController.HandleGetSearchedVideos)

router.post('/uploadPhoto' ,  validateUploadPhoto ,checkAuth , AuthController.HandelUploadPhoto)

router.post('/comment' ,  validateComment ,checkAuth , AuthController.HandelAddComment)

router.put('/like' ,  validateLike ,checkAuth , AuthController.HandelPhotoLike)

router.post('/verifyToken' , AuthController.isTokenVerifyied)




export default router