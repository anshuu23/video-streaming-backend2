
import { Request, Response, NextFunction } from "express";
import 'uuid'
import AWS from 'aws-sdk'

import { CustomError, defaultRes } from "../util"
import { randomUUID } from "crypto";
import { getEnvVariables } from "../getenv";
import { uploadVideoDetails } from "../repository";
import multer from "multer"
import path from "path";
import fs from "fs";
import mime from 'mime-types';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})


const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png" , ".svg"];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."));
    }
};

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from "sharp";





const accessKeyId = getEnvVariables().accessKeyId as string
const secretAccessKey = getEnvVariables().secretAccessKey as string
// Setup your AWS S3 client
const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

async function uploadSingleImageToS3(localFilePath: string, s3Key: string, bucketName: string) {

    const compressImageByMimeRes = await compressImageByMime(localFilePath)

    const uploadCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: compressImageByMimeRes.buffer,
        ContentType: compressImageByMimeRes.contentType, 
    });

    await s3Client.send(uploadCommand);
    console.log(`✅ Uploaded to S3: ${s3Key}`);
}


async function compressImageByMime(localFilePath: string) {
  const mimeType = mime.lookup(localFilePath); 
  const image = sharp(localFilePath).resize(800);
  let buffer;

  switch (mimeType) {
    case 'image/jpeg':
      buffer = await image.jpeg({ quality: 50 }).toBuffer();
      break;
    case 'image/png':
      buffer = await image.png({ quality: 50 }).toBuffer();
      break;
    case 'image/webp':
      buffer = await image.webp({ quality: 50 }).toBuffer();
      break;
    case 'image/avif':
      buffer = await image.avif({ quality: 50 }).toBuffer();
      break;
    case 'image/tiff':
      buffer = await image.tiff({ quality: 50 }).toBuffer();
      break;
    case 'image/svg+xml':
      buffer = fs.createReadStream(localFilePath);
      break;
    default:
      throw new Error(`❌ Unsupported MIME type: ${mimeType}`);
  }

  return { buffer, contentType: mimeType };
}


export const upload = multer({ storage, fileFilter })
export {uploadSingleImageToS3}
