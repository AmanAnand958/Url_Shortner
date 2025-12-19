import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema.js";
import { verifyPassword } from "../utils/hash.js";

export const findUserByEmail = async (email) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
};

export const createUser = async (userData) => {
    const [user] = await db.insert(usersTable).values(userData).returning({ id: usersTable.id });
    return user;
};

export const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isMatch = verifyPassword(password, user.salt, user.password);
    if (!isMatch) return null;

    return user;
};
