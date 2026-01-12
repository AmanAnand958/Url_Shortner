import express from "express";
const router = express.Router();
import { generateShortUrl } from "../utils/shorturl.js";
import { db } from "../db/index.js";
import { urlTable } from "../db/schema.js"; 
import { shortenUrlSchema } from "../validations/request.validation.js";
import { eq } from "drizzle-orm"; // Added missing import
import 'dotenv/config';
import { ensureloginMiddleware } from "../middleware/ensurelogin.middleware.js";
import { createShortUrl } from "../services/url.service.js";


router.get('/getallurls',ensureloginMiddleware,async (req,res)=>{
    try {
        const urls = await db.select({url:urlTable.url,shortUrl:urlTable.shortUrl}).from(urlTable).where(eq(urlTable.userId, req.user.id));
        return res.status(200).json({urls});    
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
})

router.post('/shorten', ensureloginMiddleware, async (req, res) => {
    try {
        const validatedResult = await shortenUrlSchema.safeParseAsync(req.body);
        if (!validatedResult.success) {
            return res.status(400).json({ message: validatedResult.error.issues[0]?.message || "Validation failed" });
        }
        
        const { url, shortUrlSuffixByUser } = validatedResult.data; 
        let shortUrlsuffix;

        if (shortUrlSuffixByUser) {
            shortUrlsuffix = shortUrlSuffixByUser;
        } else {
            shortUrlsuffix = generateShortUrl();
            if (!shortUrlsuffix) {
                return res.status(500).json({ message: "Could not generate short URL" });
            }
        }

        // Check for collision
        if (shortUrlsuffix) {
            const existingUrl = await createShortUrl(shortUrlsuffix);
            if (existingUrl.length > 0) {
                return res.status(400).json({ message: "Short URL already exists" });
            }
        }

        const urlData = {
            shortUrl: shortUrlsuffix,
            url: url,
            userId: req.user.id
        };

        await db.insert(urlTable).values(urlData);
        
        const fullShortUrl = `${process.env.BASE_URL || `http://localhost:3000`}/${shortUrlsuffix}`;

        return res.status(200).json({ 
            message: "Short URL generated successfully", 
            shortUrl: fullShortUrl 
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); 
    }
});

router.get('/:route', async (req, res) => {
    try {
        const { route } = req.params;
        
        // Fix: Select from urlTable and handle array returned by Drizzle
        const [result] = await db.select({ targetUrl: urlTable.url })
            .from(urlTable)
            .where(eq(urlTable.shortUrl, route));

        if (!result) {
            return res.status(404).json({ message: "URL not found" });
        }

        return res.redirect(result.targetUrl);
        
    } catch (error) {
        console.error("Redirect error:", error);
        return res.status(500).json({ message: "Internal server error" }); 
    }
});

router.delete('/:route',ensureloginMiddleware,async (req,res)=>{
    try {
        const {route} = req.params;
        await db.delete(urlTable).where(eq(urlTable.shortUrl,route))
        return res.status(200).json({message:"URL Deleted Successfully"})   
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
})

router.put('/:route',ensureloginMiddleware,async (req,res)=>{
    try {
        const {route} = req.params;
        let newSuffix=req.body.shortUrlSuffix;
        if(newSuffix){
            if(newSuffix==route){
                return res.status(400).json({ message: "New Url is Same as Previous Url" });
            }
        }
        else{
            const NewUrl = generateShortUrl();
            if (!NewUrl) {
                return res.status(500).json({ message: "Could not generate short URL" });
            }
        }
        newSuffix=newSuffix || NewUrl;

        await db.update(urlTable).set({url:req.body.url,shortUrl:newSuffix}).where(eq(urlTable.shortUrl,route))
        return res.status(200).json({message:"URL Updated Successfully"})   
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
})

export default router;