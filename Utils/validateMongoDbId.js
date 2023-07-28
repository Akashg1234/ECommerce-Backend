import mongoose from "mongoose";

export const validateMongoDbId = (id)=>{
    if(! mongoose.Types.ObjectId.isValid(id)){
        let error = new Error("The Id is not valid")
        error.name="Mongo Id error"
        error.status=404
        throw error
    }
}