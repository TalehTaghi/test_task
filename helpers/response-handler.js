export const sendSuccess = (res, status, data) => {
    res.status(status).send(data);
}

export const sendError = (res, status, type, message) => {
    res.status(status).send({ type, message });
}