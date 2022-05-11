import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());
app.set("view engine", "ejs");

const port = process.env.PORT

const httpServer = http.createServer(app);

import { router as apiRouter } from './routes/apiRouter.js'
import { readCredentials } from "./services/authorization-service.js";

app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = (body) => {
    res.locals.body = body;
    if (body.data) {
      readCredentials(body);
    }
    return oldJson.call(res, body);
  };
  next();
})

app.use('/api', apiRouter);

httpServer.listen(port || 3000, () => {
  console.log('SERVER STARTED AT PORT 3000');
});