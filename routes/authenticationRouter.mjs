import { Router } from "express";
import { authenticationController } from "../controllers/authController.mjs";

export const authenticationRouter = Router();

authenticationRouter.post('/', authenticationController.authenticate)