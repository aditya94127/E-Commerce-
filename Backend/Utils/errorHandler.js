class ErrorHandler extends Error{        //errorhandler mae error daal rhe
    constructor(message,statusCode){
        super(message);
        
        this.statusCode = statusCode;
        console.log(this.statusCode)
        Error.captureStackTrace(this,this.constructor);
        
    }
}

module.exports = ErrorHandler;