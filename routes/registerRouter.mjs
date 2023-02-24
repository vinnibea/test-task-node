import { Router } from "express";
import { registerController } from "../controllers/registerController.mjs";

const registerRouter = Router();

registerRouter.post('/', registerController.register);

export default registerRouter;