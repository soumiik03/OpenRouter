import { Router } from "express";

import {signup,signin,profile} from "../controllers/auth.controller";

import { authMiddleware } from "../middlewares/auth.middleware";

import { validate } from "../middlewares/validate.middleware";

import {signupSchema,signinSchema} from "../schemas/auth.schema";

const router = Router();

router.post(
    "/signup",
    validate(signupSchema),
    signup
);

router.post(
    "/signin",
    validate(signinSchema),
    signin
);

router.get(
    "/profile",
    authMiddleware,
    profile
);

export default router;