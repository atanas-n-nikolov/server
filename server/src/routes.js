import { Router } from "express";
import homeController from "./controllers/homeController.js";
import planetController from "./controllers/planetController.js";
import quizController from "./controllers/quizController.js";
import userController from "./controllers/userController.js";
import factController from "./controllers/factController.js";

const routes = Router();

routes.use(homeController);
routes.use(planetController);
routes.use(quizController);
routes.use(userController);
routes.use(factController);

export default routes;