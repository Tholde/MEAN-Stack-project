import {ErrorRequestHandler, Response, Request, NextFunction} from "express";
import {ErrorResponse} from "../utils/ErrorResponse";


export const ErrorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction):void => {
    let error = {...err};
    error.message = err.message;

//lorsque MongoDB ne parvient pas à convertir une valeur (ex. : un ID invalide).
    if (err.name === "CastError") {
        const message = `Ressource not found ${err.message}`;
        error = new ErrorResponse(message, 404);
    }
// lorsqu'une tentative d'insertion viole une contrainte d'unicité dans MongoDB.
    if (err.code === 11000) {
        const message = `Ressource already exists ${err.message}`;
        error = new ErrorResponse(message, 404);
    }
// lorsque les données ne respectent pas les contraintes de validation définies dans Mongoose.
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(
            (val: any) => " " + val.message
        );
        error = new ErrorResponse(message.join(","), 400);
    }
    // res.status(error.statusCode || 500).json({
    //     success:false,
    //     error: error.message || "Server error",
    // })
    if (!res.headersSent) {
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error',
        });
    } else {
    next(err);
  }
}
//module.exports = ErrorHandler