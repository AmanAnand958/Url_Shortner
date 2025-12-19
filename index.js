
import 'dotenv/config';

import express from "express";
import userRouter from "./Routes/user.routes.js";  
import urlRouter from "./Routes/url.routes.js";
import { authenticationMiddleware } from './middleware/auth.middleware.js';

const app = express();
app.use(express.json()); 
app.use(authenticationMiddleware)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user',userRouter);    
app.use(urlRouter);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
