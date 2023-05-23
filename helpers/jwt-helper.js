import jwt from 'jsonwebtoken';

export const generateAuthTokens = (data) => {
    return {
        accessToken: jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '10m' }),
        refreshToken: jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '30d' }),
    };
}