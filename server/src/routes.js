import { Router } from "express";
import homeController from "./controllers/homeController.js";
import planetController from "./controllers/planetController.js";

const routes = Router();

routes.use(homeController);
routes.use(planetController);

export default routes;