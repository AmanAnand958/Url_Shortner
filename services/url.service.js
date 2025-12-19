import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { urlTable } from "../db/schema.js";

export async function createShortUrl(shortUrlsuffix) {
    // Corrected to include eq import
    const existingUrl = await db.select().from(urlTable).where(eq(urlTable.shortUrl, shortUrlsuffix));
    return existingUrl;
}
