const { Error } = require("mongoose");
const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler=(err, req,res,next)=>{
    let error={...err}

    error.message=err.message;
    //Log for dev
    console.log(err);

    //Mongoose bad obj ID
    if(err.name==='CastError'){
        const message=`Resource not found.`;
        error=new ErrorResponse(message, 404)
    }
    //Mongoose duplicate key
    if(err.code===11000){
        const message="Duplicate fields entered";
        error=new ErrorResponse(message,400)

    }
    //Mongoose validation err
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map(val=>val.message);
        error=new ErrorResponse(message,400);
    }
    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message || 'Server Error'
    })
    
}
module.exports=errorHandler;