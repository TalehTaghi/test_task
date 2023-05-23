import redisClient from "../db/redis.js";

export const blacklistTokens = async (tokens, time) => {
    for (const token of tokens) {
        await redisClient.set(`bl_${token}`, 1, 'EX', time);
    }
}

export const isTokenInBlacklist = async (token) => {
    return await redisClient.exists(`bl_${token}`);
}