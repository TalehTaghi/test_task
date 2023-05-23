import { Router } from 'express';
import authController from "../controllers/auth.controller.js";
import validate from "../validators/index.js";
import signUpValidator from "../validators/auth/signup.validator.js";
import loginValidator from "../validators/auth/login.validator.js";
import isAuthMiddleware from "../middleware/is-auth.middleware.js";
import refreshAccessTokenValidator from "../validators/auth/refresh-access-token.validator.js";

const router = Router();

router.post('/signup', validate(signUpValidator), authController.signup);

router.post('/signin', validate(loginValidator), authController.login);

router.post('/signin/new_token', validate(refreshAccessTokenValidator), authController.refreshAccessToken);

router.get('/logout', isAuthMiddleware, authController.logout);

router.get('/info', isAuthMiddleware, authController.whoAmI);

export default router;