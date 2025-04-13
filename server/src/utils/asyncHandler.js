import getError from './getError.js';

export default function asyncHandler(fn) {
    return async function (req, res, next) {
        try {
            await fn(req, res, next);
        } catch (error) {
            const { message, statusCode } = await getError(error);
            res.status(statusCode).json({ error: message });
        }
    };
};