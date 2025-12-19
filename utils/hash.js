import { createHmac, randomBytes } from "node:crypto";

export const hashPassword = (password) => {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac('sha256', salt).update(password).digest("hex");
    return { salt, hashedPassword };
};

export const verifyPassword = (password, salt, storedHash) => {
    const hash = createHmac('sha256', salt).update(password).digest("hex");
    return hash === storedHash;
};
