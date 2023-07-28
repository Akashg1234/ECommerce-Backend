export const errorThrow = (errMessage,code,errCause)=>{
    let error = new Error(errMessage)
    error.cause=errCause
    error.code=code
    throw error
}
export const ErrorLogger=(err,req,res,next)=>{
    console.log("\x1b[5m\x1b[1m\x1b[31m",err.message,"\x1b[0m");
    next(err)
}
export const ErrorHandler = (err,req,res,next)=>{
    
    const statusCode = err.code||400
    res.status(statusCode).json({
        success:false,
        cause:err.cause,
        message:err.message,
        stack:err.stack
    })
}
