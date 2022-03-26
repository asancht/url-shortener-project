import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import morgan from "morgan";
import fs from "fs";
import dotenv from "dotenv";
import routes from "./routes";
import db from "./db/mongodb";
const RedisStore = require("connect-redis")(session);
import { redis } from "./db/redis";
import swaggerSpec from "./module/swagger";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const secret: string = process.env.SESSION_SECRET!;
const app = express();
const port = process.env.PORT as unknown as number;


//configuracion Swagger

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Configuracion de logs
app.use(morgan("dev"));
const accessLogStream = fs.createWriteStream("./logs/http.log", { flags: "a" });

// Setup the logger
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


// parse application/json
app.use(bodyParser.json());

//Inicio Express
app.listen(port, "0.0.0.0", () => {
  console.log(`Application listening en http://localhost:${port}`);
  db();
  routes(app);
});
