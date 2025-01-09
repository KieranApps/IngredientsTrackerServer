import { ApplicationError, InternalServerError } from './exceptions.js';

async function errorHandler(err, req, res, _next) {
    const applicationError = (
        err instanceof ApplicationError ? err : new InternalServerError(err, err)
    );

    const isServerError = (applicationError.statusCode >= 500);
    if (isServerError) {
        console.log(applicationError.toJSON(true));
    }

    const internalServerError = process.env.NODE_ENV === 'development';
    res.status(applicationError.statusCode).json(applicationError.toJSON(internalServerError));
}

export default errorHandler;