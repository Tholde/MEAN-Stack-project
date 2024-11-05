import mongoose from "mongoose";
import router from "./routes/router";
import express, {Request, Response, NextFunction} from "express";
import {connectToDatabase} from "./database/connection";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { ErrorHandler } from './middleware/error';
import swaggerDocs from "./utils/swagger";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./utils/swagger";
import swaggerUi from "swagger-ui-express";

const app = express();
dotenv.config();
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

//Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev")); //middleware de journalisation (logging) des requêtes HTTP dans Express no sady mi-affiche ny methode, url de la requete, code de statut, temps d'execution de la requete
}
app.use(bodyParser.json({limit: "5mb"})); //limiter-na ho 5 Mo ny data ampidirin'ny user @ API POST na PUT
app.use(bodyParser.urlencoded({limit: "5mb", extended: true,})); //ampiasaina amin'ny donnees encodees @ applicatino/x-www-form-urlencoded
// app.use(cookieParser()); //mamaky ny cookies attaches @ requetes HTTP igny.
app.use(mongoSanitize()); //ialana amin'ny injections MongoDB no sady manadio ny user miditra.
app.use(ErrorHandler);
const port = parseInt(process.env.PORT as string) || 8000;

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
        error: {
            message,
            status,
        },
    });
});
const limiter = rateLimit({
    windowMs: 1000, // Période de 1 seconde (en millisecondes)
    max: 1000, // Max 1000 requêtes autorisées par client pendant la fenetre definie mamerina statut 429 izy nao mihoatra
    standardHeaders: true, // Ajoute les infos de rate limit aux en-têtes standards
    legacyHeaders: false, // Désactive les en-têtes obsolètes de rate limit
});
app.use(limiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
connectToDatabase().then(r =>
    app.listen(port, () => {
        console.log("Server started on port 3000!");
        console.log("swagger run too.");
    })).catch(err => console.log(err));
