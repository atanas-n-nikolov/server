import jwt from '../jwt.js';
import asyncHandler from '../utils/asyncHandler.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.isAuthenticated = false;
        return next();
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
    req.isAuthenticated = true;
    res.locals.user = decodedToken;

    next();
});

export const isAuth = asyncHandler(async (req, res, next) => {
    if (!req.isAuthenticated) {
        throw { message: req.t?.('pleaseLogin') || 'Please login!', statusCode: 401 };
    }

    next();
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw { message: req.t?.('noUserData') || 'No user data found.', statusCode: 401 };
    }

    if (req.user.role !== 'admin') {
        throw { message: req.t?.('adminOnly') || 'Access denied. Admins only.', statusCode: 403 };
    }

    next();
});
