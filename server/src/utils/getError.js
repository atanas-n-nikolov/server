export default function getError(error) {
    switch (error.name) {
        case 'ValidationError':
            return {
                message: Object.values(error.errors)[0]?.message || 'Validation error',
                statusCode: 400,
            };
        case 'CastError':
            return {
                message: 'Invalid data format. Please check your input.',
                statusCode: 400,
            };
        case 'MongoError':
            return {
                message: 'Database error. Please try again later.',
                statusCode: 500,
            };
        case 'NotFound':
            return {
                message: 'Resource not found.',
                statusCode: 404,
            };
        default:
            return {
                message: error.message || 'An unexpected error occurred.',
                statusCode: 500,
            };
    };
};
