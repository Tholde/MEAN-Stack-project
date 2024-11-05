// import express, {Router} from 'express';
// import authRouter from "./api/authRouter";
// import userRouter from "./api/userRouter";
//
//
// const router = Router();
// router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const origin = req.headers.origin;
//     console.log(req.method);
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,OPTIONS,PATCH,DELETE,PATCH");
//     // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, API-KEY, D-Token, D-Appid");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     if (req.method === "OPTIONS") {
//         return res.sendStatus(200);
//     }
//     return next();
// })
// router.use('/', authRouter, userRouter);
// export default router;

import express, { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import authRouter from './api/authRouter';
import userRouter from './api/userRouter';

const router = Router();

// Middleware with proper return type
const corsMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const origin = req.headers.origin;
    console.log(req.method);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);  // Ensure no further execution with 'return'
        return;
    }

    next();  // Explicitly call next if not an OPTIONS request
};

// Use middleware and routers
router.use(corsMiddleware);
router.use('/auth', authRouter);
router.use('/user', userRouter);
// router.use('/', authRouter, userRouter)

export default router;

