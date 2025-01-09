import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import http from 'http';

import router from './components/router/routes.js';
import errorHandler from './components/utils/errorhandler.js';

const PORT = process.env.PORT;

const app = express();

app.use(express.static("static"));

// JWT session token setup for 'cookies'

app.use(helmet());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && !req.secure) {
        // Can change to 404
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
});

app.use(bodyParser.json());

app.use(router);

app.use(errorHandler);

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Listening on Port: ${PORT} \nConnected...`));