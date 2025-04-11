import { Router } from "express";
import Planet from '../models/Planet.js';

const homeController = Router();

homeController.get('/', async (req, res) => {
    try {
        const planets = await Planet.find();
        res.status(200).json(planets);
    } catch (error) {
        
    };
});

export default homeController;