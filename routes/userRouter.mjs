import { Router } from "express";
import { accessController } from "../controllers/accessController.mjs";

export const userRouter = Router();

userRouter.get('/', accessController.getUsers)
userRouter.post('/:id', accessController.editUser);