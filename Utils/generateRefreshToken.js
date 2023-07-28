import jsonwebtoken from "jsonwebtoken";
import { env } from "../index.js";

export const getGeneratedToken=async(id)=>{
    await jsonwebtoken.sign({jwt_refresh_token_id:id},env.JWT_SECRET_KEY,{algorithm:'RS512',expiresIn:'15d'})
}