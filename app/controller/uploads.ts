import { Request, Response, NextFunction } from "express";
import 'uuid'
import AWS from 'aws-sdk'

import { CustomError, defaultRes } from "../util"
import { randomUUID } from "crypto";
import { getEnvVariables } from "../../getenv";
import { uploadVideoDetails } from "../repository";
import multer from "multer"
import path from "path";
import { uploadSingleImageToS3 } from "../services";
import { AuthRequest } from "../middleware";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})


const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."));
    }
};

const upload = multer({ storage, fileFilter })

async function HandeluplodVideoDetails(req: Request, res: Response, next: NextFunction) {

    try {

        const accessKeyId = getEnvVariables().accessKeyId
        const secretAccessKey = getEnvVariables().secretAccessKey
        const userId = (req as AuthRequest).user?.userId;
        const userName = (req as AuthRequest).user?.userName;
        console.log('ttttt', userId)

        const {
            title,
            description,
            categories,
            tags,
            visibility,
        } = req.body;

        const token = req.body.token

        const categoriess = JSON.parse(categories);
        const uid = randomUUID()

        const tagsArr = tags.split(",");
        const thumbnailPath = path.join(__dirname, '..', '..', 'uploads', req.file?.filename as string);

        await uploadSingleImageToS3(thumbnailPath, "thumbnail/" + uid, "final-video-upload")

        const url = await GenerateSignedUrl(uid)

        //
        // 
        const uploadVideoDetailsRes = await uploadVideoDetails(uid ,userId ,title , description , tagsArr , visibility , categoriess , userName)

        defaultRes(res, 200,'data added successfully', [url , uid])

    }
    catch (error: any) {
        console.log(error, "trweriwueruiweruiwe")
        next(error)
    }

}


async function GenerateSignedUrl(id: string) {

    const accessKeyId = getEnvVariables().accessKeyId
    const secretAccessKey = getEnvVariables().secretAccessKey

    AWS.config.update({ accessKeyId, secretAccessKey, region: 'ap-south-1' })

    const uid = id + '.mp4'

    const s3 = new AWS.S3()

    const myBucket = 'video-storage-signed-url2'
    const myKey = uid
    const signedUrlExpireSeconds = 60 * 5

    return  s3.getSignedUrl('putObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
    })

}
export { GenerateSignedUrl, HandeluplodVideoDetails }

function useEffect() {
    throw new Error("Function not implemented.");
}