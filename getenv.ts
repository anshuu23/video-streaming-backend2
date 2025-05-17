import  dotenv  from "dotenv" 
dotenv.config()

function getEnvVariables(){
    const PORT = process.env.PORT
    const SECRET_KEY = process.env.SECRET_KEY
    const secretAccessKey = process.env.secretAccessKey
    const accessKeyId = process.env.accessKeyId

    return {
        PORT , SECRET_KEY , secretAccessKey , accessKeyId
    }
}

export {getEnvVariables}