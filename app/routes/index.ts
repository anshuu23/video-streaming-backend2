import express from "express";
import { validateCreateAccountReq , validateUserLoginReq ,validateUploadPhoto , validateComment , validateLike} from "../util";


const router = express.Router()
import { AuthController, UploadsController } from "../controller";
import { checkAuth, defaultErr, wrongPath } from "../middleware";


router.post('/createAccount' , validateCreateAccountReq , AuthController.HandelCreateUserAccount)

router.post('/loginUser' , validateUserLoginReq, AuthController.HandelUserLogin)

router.post('/uploadPhoto' ,  validateUploadPhoto ,checkAuth , AuthController.HandelUploadPhoto)

router.post('/comment' ,  validateComment ,checkAuth , AuthController.HandelAddComment)

router.put('/like' ,  validateLike ,checkAuth , AuthController.HandelPhotoLike)

router.post('/verifyToken' , AuthController.isTokenVerifyied)

router.get('/getSignedUrl' , UploadsController.GenerateSignedUrl)



export default router