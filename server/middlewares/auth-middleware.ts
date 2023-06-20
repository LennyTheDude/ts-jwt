import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-error";
import tokenService from "../services/token-service";

interface IUserRequest extends Request {
    user: any
}

export default function (req: IUserRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        next(ApiError.UnauthorizedError());
    }
}