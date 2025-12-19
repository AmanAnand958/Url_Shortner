
import { randomBytes } from "node:crypto";

function randomString(length) {
  if (length % 2 !== 0) {
    length++;
  }

  return randomBytes(length / 2).toString("hex");
}



export function generateShortUrl(){
    try {
        const shortUrlsuffix = randomString(8);
        return shortUrlsuffix;
        
    } catch (error) {
        console.log(error);
        return null;
    }   
}




