import { Router } from "express";
import Planets from '../models/Planets.js';
import Facts from '../models/Facts.js';
import Quiz from "../models/Quiz.js";
import asyncHandler from "../utils/asyncHandler.js";

const homeController = Router();

homeController.get('/', asyncHandler(async (req, res) => {
    const today = new Date();
    const dateString = today.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit' });

    const planets = await Planets.find();
    const latestQuiz = await Quiz.findOne().sort({ createdAt: -1 }).limit(1);
    const fact = await Facts.findOne({ date: dateString });

    return res.status(200).json({
        fact: fact || [],
        planets,
        latestQuiz: latestQuiz || []
    });
}));

export default homeController;