import express from "express";
import {
  firstConnection,
  getTasks, initConnection,
} from "../controllers/apiCtrl.js";
import {getTeams} from "../controllers/api-middleware.js";

export const router = express.Router();

router.get('/get-tasks',getTeams, getTasks);
router.post('/first-connection', firstConnection);
router.post('/init-connection', initConnection);