const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { custom } = require('joi')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    statusCode:err.statusCodes||StatusCodes.INTERNAL_SERVER_ERROR,
    message:err.message||'Something went wrong'
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if(err.name==="ValidationError"){
    customError.message=Object.values(err.errors).map((item)=>item.message).join(',');
    customError.statusCode=400;
  }

  if(err.code && err.code===11000){
    customError.message=`Duplicate entry entered for ${Object.keys(err.keyValue)} field,please choose another value`;
    customError.statusCode=400;
  }

  if(err.name==="CastError"){
    customError.message=`${err.kind} is not a valid ${err.value}`;
    customError.statusCode=400;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({message:customError.message})
}

module.exports = errorHandlerMiddleware
