import {Schema,connect,model} from "mongoose";
import { env } from "../index.js";

export const dbConnect=function(){
    connect(env.MONGO_DB_URL)
    .then(()=>console.log("\x1b[1m\x1b[32m %s \x1b[0m","DB Connected"))
    .catch((error)=>console.error("\x1b[5m\x1b[1m\x1b[31m %s \x1b[0m",error))
}

export {Schema,model}