import { Router } from "express";
import { isAuth } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Planets from "../models/Planets.js";
import userService from "../services/userService.js";
import asyncHandler from '../utils/asyncHandler.js';
import i18next from '../i18n.js';

const userController = Router();

userController.post('/register', asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, rePassword } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: i18next.t('missingFields') });
    }

    const user = await userService.register(firstName, lastName, email, password, rePassword);
    return res.status(201).json(user);
}));

userController.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: i18next.t('missingFields') });
    }

    const user = await userService.login(email, password);
    return res.status(200).json(user);
}));

userController.get('/profile/:userId', isAuth, asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: i18next.t('userNotFound') });
    }

    const planets = await Planets.find({ 'comments.user': userId })
        .populate('comments.user', 'firstName lastName')
        .exec();

    const userComments = planets.flatMap(planet =>
        planet.comments
            .filter(comment => comment.user && comment.user._id.toString() === userId)
            .map(comment => ({
                planetId: planet._id,
                commentId: comment._id,
                planetName: planet.name,
                commentText: comment.text,
                createdAt: comment.createdAt,
            }))
    );

    return res.status(200).json({
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            score: user.score,
            answers: user.answers || [],
            createdAt: user.createdAt,
        },
        comments: userComments
    });
}));

userController.put('/profile/:userId/score', isAuth, asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(userId, updateData);

    if (!updatedUser) {
        return res.status(404).json({ message: i18next.t('userNotFound') });
    }

    return res.status(200).json(updatedUser);
}));

userController.put('/profile/:userId/edit', isAuth, asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;

    if (req.user.id !== userId) {
        return res.status(403).json({ message: i18next.t('accessDenied') });
    }

    const updatedUser = await userService.updateUser(userId, updateData);

    if (!updatedUser) {
        return res.status(404).json({ message: i18next.t('userNotFound') });
    }

    return res.status(200).json({
            message: i18next.t('updateUser'),
            updatedUser,
        });
}));

userController.delete('/profile/:userId', isAuth, asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    if (req.user.id !== userId) {
        return res.status(403).json({ message: i18next.t('accessDenied') });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
        return res.status(404).json({ message: i18next.t('userNotFound') });
    }

    return res.status(200).json({ message: i18next.t('userDeleted') });
}));

userController.put('/profile/:userId/lang', isAuth, (req, res) => {
    const { lang } = req.body;

    if (lang && ['en', 'bg'].includes(lang)) {
        res.cookie('myLang', lang, {
            maxAge: 900000,
            httpOnly: true,
            sameSite: 'Strict'
        });
        return res.status(204);
    } else {
        return res.status(400).json({ message: i18next.t('invalidLanguageSelection') });
    }
});

export default userController;
