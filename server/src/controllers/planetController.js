import { Router } from "express";
import Planets from '../models/Planets.js';
import User from '../models/User.js';
import getError from "../utils/getError.js";
import { isAdmin, isAuth } from "../middleware/authMiddleware.js";

const planetController = Router();

planetController.get("/planets", async (req, res) => {
    const options = req.query;
    let selectedFields = '';

    if (options.fields) {
        const fields = options.fields.split(',');
        selectedFields = fields.join(' ');
    };

    try {
        const planets = selectedFields
            ? await Planets.find({}, selectedFields).sort({ order: 1 })
            : await Planets.find().sort({ order: 1 });

        if (!planets || planets.length === 0) {
            return res.status(404).json({ message: 'No planets found.' });
        };

        res.status(200).json(planets);
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message });
    };
});

planetController.get("/planets/:planetId", async (req, res) => {
    try {
        const planetId = req.params.planetId;

        if(!planetId) {
            return res.status(404).json({ message: 'No planets id.' });
        };

        const planet = await Planets.findById(planetId).populate('comments.user', 'firstName lastName');

        if (!planet) {
            return res.status(404).json({ message: 'Planet not found.' });
        };

        res.json(planet);
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message });
    };
});

planetController.put('/planets/edit', isAdmin, isAuth, async (req, res) => {
    const { name, type, image, distanceToSun, size, description, order, planetId } = req.body;
    const ownerId = req.user._id;

    if (!name || !type || !image || !distanceToSun || !size || !description || !order, !ownerId) {
        return res.status(400).json({ message: 'All fields are required.' });
    };

    try {
        const planet = await Planets.findByIdAndUpdate(planetId, { name, type, image, distanceToSun, size, description, order, comments: [], ownerId }, { new: true });

        if (!planet) {
            return res.status(404).json({ message: 'Planet not found for update.' });
        };
        
        res.status(201).json(planet);
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message });
    };
});

planetController.post('/planet/create', isAdmin, isAuth, async (req, res) => {
    const { name, type, image, distanceToSun, size, description, order } = req.body;
    const comments = [];
    const ownerId = req.user._id;

    if (!name || !type || !image || !distanceToSun || !size || !description || !order) {
        return res.status(400).json({ message: 'All fields are required.' });
    };

    const existingPlanet = await Planets.findOne({ name });

    if (existingPlanet) {
        return res.status(400).json({ message: 'Planet with this name already exists.' });
    };

    try {
        const planet = await Planets.create({ name, type, image, distanceToSun, size, description, comments, order, ownerId });
        res.status(201).json(planet);
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message });
    };
});

planetController.delete('/planet/:planetId/delete', isAdmin, isAuth, async (req, res) => {
    const { planetId } = req.params;

    try {
        const planet = await Planets.findByIdAndDelete(planetId);
        if (!planet) {
            return res.status(404).json({ message: 'Planet not found.' });
        };
        res.status(201).json(planet);
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message });
    };
});

planetController.post('/planet/:planetId/comment', isAuth, async (req, res) => {
    const { planetId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    try {
        const planet = await Planets.findById(planetId);
        if (!planet) return res.status(404).json({ message: 'Planet not found' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newComment = {
            user: userId,
            text,
            createdAt: Date.now()
        };

        planet.comments.push(newComment);
        user.comments.push(planetId);

        await planet.save();
        await user.save();

        const updatedPlanet = await Planets.findById(planetId)
            .populate('comments.user', 'firstName lastName')
            .exec();

        res.status(201).json({ message: 'Comment added successfully', planet: updatedPlanet });
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message });
    };
});

planetController.delete('/planet/:planetId/comment/:commentId', isAuth, async (req, res) => {
    const { planetId, commentId } = req.params;
    const userId = req.user._id;

    try {
        const planet = await Planets.findById(planetId);
        const user = await User.findById(userId);

        if (!planet || !user) {
            return res.status(404).json({ message: 'Planet or User not found' });
        };

        const comment = planet.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        };

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only delete your own comments' });
        };

        planet.comments.pull(commentId);
        user.comments.pull(planetId);

        await planet.save();
        await user.save();

        const updatedPlanet = await Planets.findById(planetId)
            .populate('comments.user', 'firstName lastName')
            .exec();

        res.status(200).json({ message: 'Comment deleted successfully', planet: updatedPlanet });
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message });
    };
});

planetController.put('/planet/:planetId/comment/:commentId', isAuth, async (req, res) => {
    const { planetId, commentId } = req.params;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'Comment text cannot be empty' });
    };

    try {
        const planet = await Planets.findById(planetId);
        const user = await User.findById(userId);

        if (!planet || !user) {
            return res.status(404).json({ message: 'Planet or User not found' });
        };

        const comment = planet.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        };

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You can only edit your own comments' });
        };

        comment.text = text;
        comment.updatedAt = Date.now();
        await planet.save();

        const updatedPlanet = await Planets.findById(planetId)
            .populate('comments.user', 'firstName lastName')
            .exec();

        res.status(200).json({ message: 'Comment updated successfully', planet: updatedPlanet });
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message });
    };
});

export default planetController;
