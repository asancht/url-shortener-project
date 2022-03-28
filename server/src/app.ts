import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import morgan from "morgan";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import dbmongo from "./db/mongodb";
import { redis } from "./db/redis";
import swaggerSpec from "./module/swagger";
import swaggerUi from "swagger-ui-express";

//Defnicion de variables
dotenv.config();
const RedisStore = require("connect-redis")(session);
const secret: string = process.env.SESSION_SECRET!;
const port = process.env.PORT as unknown as number;

//Configuraciuón Express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());


//configuracion Swagger
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Configuracion de logs
app.use(morgan("dev"));
const accessLogStream = fs.createWriteStream("./logs/http.log", { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

//Configuración de Redis
app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: secret,
    name: "SESSION",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      path: "/",
      maxAge: 3600000,
      httpOnly: false,
      secure: false,
    },
  })
);

//Inicio servidor express
app.listen(port,function(){
  console.log(`Application listening in port:${port}`);
  dbmongo();
  routes(app);
});
