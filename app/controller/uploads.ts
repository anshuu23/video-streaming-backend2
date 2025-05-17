import { Request , Response , NextFunction } from "express";
import 'uuid'
import AWS from 'aws-sdk'

import { CustomError, defaultRes } from "../util"
import { randomUUID } from "crypto";
import { getEnvVariables } from "../../getenv";

async function GenerateSignedUrl(req: Request, res: Response, next: NextFunction) {

    try { 

        const  accessKeyId = getEnvVariables().accessKeyId
        const  secretAccessKey = getEnvVariables().secretAccessKey

        AWS.config.update({ accessKeyId, secretAccessKey, region: 'ap-south-1' })

        const uid = randomUUID()

        const s3 = new AWS.S3()

        const myBucket = 'video-storage-signed-url2'
        const myKey = uid
        const signedUrlExpireSeconds = 60 * 5

        const url = s3.getSignedUrl('putObject', {
            Bucket: myBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
        })

        console.log('output--', url)
        defaultRes(res, 200,' Url generated successfully', [url , uid])

    }
    catch (error: any) {
        console.log(error, "trweriwueruiweruiwe")
        next(error)
    }

}

export {GenerateSignedUrl}

function useEffect() {
    throw new Error("Function not implemented.");
}
