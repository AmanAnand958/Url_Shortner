import express from "express";


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
    