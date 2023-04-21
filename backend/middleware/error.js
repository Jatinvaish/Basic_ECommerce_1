const ErrorHandler = require("../utils/errorhandleer");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error"

    //Wrong MOngodb Erro (Important)
    if (err.name === "CastError") {
        const message = `Resource Not Forund ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong JWT Token Error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token Is Invalid , try again.`;
        err = new ErrorHandler(message, 400);
    }

    //JWT Expire Error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token Is Expired , try again.`;
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: true,
        message: err.message,// we can also use .slack (try this and see what happening....)
    });
};