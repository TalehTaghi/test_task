import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { sendError, sendSuccess } from "../helpers/response-handler.js";
import { generateAuthTokens } from "../helpers/jwt-helper.js";
import { blacklistTokens, isTokenInBlacklist } from "../helpers/redis-helper.js";
import { TenMinutesInSeconds, WeekInSeconds } from "../helpers/constants.js";
import jwt from "jsonwebtoken";

const authController = {};

authController.signup = async (req, res) => {
    const userObj = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync()),
    }

    try {
        let user = await User.create(userObj);
        user = user.toJSON();
        delete user.password;
        const authTokens = generateAuthTokens(user, '10m');

        sendSuccess(res, 201, authTokens);
    } catch (error) {
        sendError(res, 500, error.name,error.errors && error.errors.length ? error.errors[0].message : "User was not created");
    }
}

authController.login = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ where: { email } });

    if (!user) {
        sendError(res, 404, 'NotFoundException', 'User with this email does not exist');
        return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
        sendError(res, 401, 'InvalidPassword', 'Password is wrong');
        return;
    }

    try {
        user = user.toJSON();
        delete user.password;
        const authTokens = generateAuthTokens(user);

        sendSuccess(res, 200, authTokens);
    } catch (error) {
        sendError(res, 500, error.name, error.message);
    }
};

authController.refreshAccessToken = async (req, res) => {
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;

    if (await isTokenInBlacklist(refreshToken)) {
        sendError(res, 401, 'Unauthorized', 'Token is blacklisted');
        return;
    }

    let payload;
    try {
        payload = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
        sendError(res, 401, error.name, error.message);
        return;
    }

    if (!payload) {
        sendError(res, 401, 'Unauthorized', 'Token is invalid');
        return;
    }

    try {
        delete payload.iat;
        delete payload.exp;

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
        await blacklistTokens([accessToken], TenMinutesInSeconds);

        sendSuccess(res, 200, { accessToken: newAccessToken });
    } catch (error) {
        sendError(res, 500, error.name, error.message);
    }
}

authController.logout = async (req, res) => {
    try {
        await blacklistTokens([
            req.get('Authorization').replace('Bearer ', ''),
            req.get('authorization-refresh')
        ], WeekInSeconds);

        sendSuccess(res, 200, true);
    } catch (error) {
        sendError(res, 500, error.name, error.message);
    }
}

authController.whoAmI = (req, res) => {
    try {
        const userInfo = { ...req.user };
        delete userInfo.iat;
        delete userInfo.exp;

        sendSuccess(res, 200, userInfo);
    } catch (error) {
        sendError(res, 500, error.name, error.message);
    }
}

export default authController;