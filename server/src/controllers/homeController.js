import { Router } from "express";
import Planets from '../models/Planets.js';
import Facts from '../models/Facts.js';
import Quiz from "../models/Quiz.js";
import getError from '../utils/getError.js';

const homeController = Router();

homeController.get('/', async (req, res) => {
    const today = new Date();
    const dateString = today.toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit' });
    try {
        let planets = await Planets.find();
        let latestQuiz = await Quiz.findOne().sort({ createdAt: -1 }).limit(1);
        let fact = await Facts.findOne({ date: dateString });

        if (!planets) planets = [];
        if (!latestQuiz) latestQuiz = [];
        if (!fact) fact = [];

        res.status(200).json({ fact, planets, latestQuiz });
    } catch (error) {
        const { message, statusCode } = getError(error);
        res.status(statusCode).json({ error: message }); 
    };
});

export default homeController;