import express from "express"
import { getEnvVariables } from "./getenv"
import router from "./routes"
import { error } from "console"
import { defaultErr , wrongPath } from "./middleware"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.urlencoded({extended  :true}))
app.use(express.json())
app.use('/' , router)


router.use(wrongPath)
router.use(defaultErr)



const PORT = getEnvVariables().PORT
app.listen( PORT , ()=>{
    console.log(`server is running on port ${PORT}`)
})