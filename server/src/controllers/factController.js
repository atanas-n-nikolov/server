import { Router } from "express";
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import Facts from "../models/Facts.js";
import i18next from '../i18n.js';

const factController = Router();

factController.get('/facts', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const facts = await Facts.find().select('_id date');
    return res.status(200).json(facts);
}));

factController.get('/fact/:factId', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const fact = await Facts.findById(req.params.factId);

    if (!fact) {
        const error = new Error(i18next.t('factNotFound'));
        error.name = 'NotFound';
        throw error;
    };

    return res.status(200).json(fact);
}));

factController.post('/fact/create', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const { title, date, year, description } = req.body;
    const ownerId = req.user._id;

    if (!title?.trim() || !date?.trim() || !year?.trim() || !description?.trim()) {
        const error = new Error(i18next.t('missingFields'));
        error.name = 'ValidationError';
        throw error;
    };

    const existingFact = await Facts.findOne({ date });
    if (existingFact) {
        const error = new Error(i18next.t('factAlreadyExistsForDate'));
        error.name = 'ValidationError';
        throw error;
    };

    const fact = await Facts.create({ title, date, year, description, ownerId });

    return res.status(201).json({
        message: i18next.t('createFact'),
        fact,
    });
}));

factController.put('/fact/:factId', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const { title, date, year, description } = req.body;

    if (!title?.trim() || !date?.trim() || !year?.trim() || !description?.trim()) {
        const error = new Error(i18next.t('missingFields'));
        error.name = 'ValidationError';
        throw error;
    };

    const duplicateDate = await Facts.findOne({ date, _id: { $ne: req.params.factId } });
    if (duplicateDate) {
        const error = new Error(i18next.t('factAlreadyExistsForDate'));
        error.name = 'ValidationError';
        throw error;
    };

    const fact = await Facts.findByIdAndUpdate(
        req.params.factId,
        { title, date, year, description },
        { new: true }
    );

    if (!fact) {
        const error = new Error(i18next.t('updateFactFailed'));
        error.name = 'NotFound';
        throw error;
    };

    return res.status(200).json({
        message: i18next.t('updateFact'),
        fact,
    });
}));

factController.delete('/fact/:factId', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const fact = await Facts.findByIdAndDelete(req.params.factId);

    if (!fact) {
        const error = new Error(i18next.t('deleteFactFailed'));
        error.name = 'NotFound';
        throw error;
    };

    return res.status(200).json({ message: i18next.t('factDeleted') });
}));

export default factController;
