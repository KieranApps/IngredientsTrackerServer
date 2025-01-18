import status from 'statuses'; // https://github.com/jshttp/statuses/blob/master/src/node.json

class ApplicationError extends Error {
    constructor(statusCode, { message, cause, extraInfo }) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.cause = cause;
        this.extraInfo = extraInfo || {};
    }

    toJSON(includeInternalFields) {
        const json = {
            name: this.name,
            statusCode: this.statusCode,
            message: this.message
        };
        if (includeInternalFields) {
            json.stack = this.stack;
            json.cause = this.cause;
            json.extraInfo = this.extraInfo;
        }
        return json;
    }
}

class InternalServerError extends ApplicationError {
    constructor(message, info) {
        message = message || 'Could not find resource';
        super(status('Internal Server Error'), { message, extraInfo: info });
    }
}

class NotFound extends ApplicationError {
    constructor(resourceType, message, info) {
        resourceType = resourceType || 'resource';
        message = message || 'Could not find resource';
        super(status('Not Found'), { message, extraInfo: info });
    }
}

class InvalidParameters extends ApplicationError {
    constructor(message, info) {
        message = message || 'Invalid Parameters';
        super(status('Bad Request'), { message, extraInfo: info });
    }
}

class BadRequest extends ApplicationError {
    constructor(message, info) {
        message = message || 'Invalid Parameters';
        super(status('Bad Request'), { message, extraInfo: info });
    }
}

class Unauthorized extends ApplicationError {
    constructor(message, extraInfo) {
        message = message || 'Unauthorized for request';
        super(status('Unauthorized'), {message, extraInfo})
    }
}

class Forbidden extends ApplicationError {
    constructor(message, extraInfo) {
        message = message || 'Unauthorized for request';
        super(status('Forbidden'), {message, extraInfo})
    }
}

export {
    ApplicationError,

    NotFound,
    InvalidParameters,
    BadRequest,
    InternalServerError,
    Unauthorized,
    Forbidden,
}