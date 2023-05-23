import { sendError } from "../helpers/response-handler.js";
import { isTokenInBlacklist } from "../helpers/redis-helper.js";
import jwt from "jsonwebtoken";

export default async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        sendError(res, 401, 'Unauthorized', 'No Authorization header');
        return;
    }

    if (authHeader.search('Bearer ') !== 0) {
        sendError(res, 401, 'Unauthorized', 'No bearer token');
        return;
    }

    const accessToken = authHeader.replace('Bearer ', '');

    if (await isTokenInBlacklist(accessToken)) {
        sendError(res, 401, 'Unauthorized', 'Token is blacklisted');
        return;
    }

    let payload;
    try {
        payload = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (error) {
        sendError(res, 401, error.name, error.message);
        return;
    }

    if (!payload) {
        sendError(res, 401, 'Unauthorized', 'Token is invalid');
        return;
    }

    req.user = payload;

    next();
}