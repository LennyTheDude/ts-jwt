const jwt = require('jsonwebtoken');
const tokenModel = require('../models').Token;

class TokenService {
    generateTokens(payload: any) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SAFEWORD, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SAFEWORD, { expiresIn: '30d' })

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await tokenModel.findOne({ where: { userId } })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save();
        }

        const token = await tokenModel.create({ userId, refreshToken })
        return token;
    }

    async removeToken(refreshToken: string) {
        const tokenData = await tokenModel.destroy({ where: { refreshToken } });
        return tokenData;
    }

    async findToken(refreshToken: string) {
        const tokenData = await tokenModel.findOne({ where: { refreshToken } });
        return tokenData;
    }

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SAFEWORD);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SAFEWORD);
            return userData;
        } catch (e) {
            return null;
        }
    }

}

export default new TokenService();
