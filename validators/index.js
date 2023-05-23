import { sendError } from "../helpers/response-handler.js";

export default (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        return next();
    } catch (error) {
        sendError(res, 422, error.name, error.message);
    }
}