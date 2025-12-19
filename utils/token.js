
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tokenSchema } from "../validations/token.validation.js";
dotenv.config();

export const generateToken = (user) => {
    const validatedData = tokenSchema.safeParse(user);
    if (!validatedData.success) {
        return null;
    }
    const token = jwt.sign(
        validatedData.data,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    return token;
};

export const validateToken = (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (error) {
        return null;
    }
};