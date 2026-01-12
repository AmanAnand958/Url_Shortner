
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { validateToken } from "../utils/token.js";

/**
 * Authentication middleware.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */
export function authenticationMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer ")){
        const token = authHeader.split(" ")[1];
        try {
            const decodedToken = validateToken(token);
            if(decodedToken){
                req.user = decodedToken;
            }
        } catch (error) {
            // Token invalid or expired, just continue without user
        }
    }
    next();
}

/**
 * Authentication middleware.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next middleware function.
 */

export function ensureloginMiddleware(req, res, next) {
    if(!req.user || !req.user.id){
        return res.status(401).json({message:"Not Logged In"});
    }
    next();
}
    

