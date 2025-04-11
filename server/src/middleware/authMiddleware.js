import jwt from "../jwt.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.isAuthenticated = false;
        return next();
    };

    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        req.isAuthenticated = true;
        res.locals.user = decodedToken;
        return next();
    } catch (err) {
        console.error("JWT verification error:", err);
        req.isAuthenticated = false;
        return next();
    };
};

export const isAuth = (req, res, next) => {
    if (!req.isAuthenticated) {
        return res.status(401).json({ message: 'Please login!' });
    };
    next();
};

export const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "No user data found." });
    };

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        };

        next();
    } catch (error) {
        console.error("Admin check error:", error);
        return res.status(500).json({ message: "Server error." });
    };
};
