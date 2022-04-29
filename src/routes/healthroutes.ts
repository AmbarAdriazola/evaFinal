import { Router } from "express";
import Healthcontroller from "../controllers/HealthController";

const healthRoutes = Router ()
const controller = new Healthcontroller()

healthRoutes.get('/info', controller.info)
healthRoutes.get('/ping', controller.ping)

export default healthRoutes