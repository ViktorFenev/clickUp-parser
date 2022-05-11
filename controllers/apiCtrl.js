import { cleanObjectFields, instance } from "../services/api-service.js";
import fs from "fs";
import {google} from "googleapis";
import {changeOAuth2ClientValue, oAuth2Client} from "../consts /consts.js";

const encodeQuery = (data) => {
  let query = "";
  for (let d in data) {
    query += encodeURIComponent(d) + '=' + encodeURIComponent(data[d]) + '&';
  }
  return query.slice(0, -1);
}
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';

const getTaskMessages = (task, time) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      instance.get(`/task/${task.id}/comment/`).then(result => {
        if (result.data.comments.length) {
          const updatedTask = cleanObjectFields({ ...task,  task_comments: result.data.comments.pop() });
          resolve(updatedTask);
        } else {
          const updatedTask = cleanObjectFields(task);
          resolve(updatedTask);
        }
      }).catch(e => {
        console.log(e);
        reject(e);
      });
    }, time);
  });
}

export const getTasks = async (req, res) => {
  try {
    // configuration array which tasks by status to get
    const statusArray = ["to do", 'complete', 'pending'];
    const statusString = statusArray.map(el => {
      return "&statuses%5B%5D=" + el;
    }).join("");

    const data = {
      archived: false,
      include_closed: false,
    };

    const query = encodeQuery(data);
    const result = await instance.get(`/team/${req.body.teamId}/task?${query}${statusString}`);
    const taskCommentPromise = [];
    for (let [i, task] of result.data.tasks.entries()) {
      if (task.id) {
          taskCommentPromise.push(getTaskMessages(task, i * 250));
      }
    }
    const tasks = await Promise.all(taskCommentPromise);
    return res.status(200).send({ data: tasks });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
}

export const firstConnection = async (req, res) => {
  // fs.readFile('credentials.json', (err, content) => {
    console.log(req.body.credentials)
    const credentials = req.body.credentials;
    // if (err) return console.log('Error loading client secret file:', err);
    // const credentials = JSON.parse(content);
    changeOAuth2ClientValue(credentials)
    // getNewToken(oAuth2Client, req.body);
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    res.status(200).send(authUrl);
  // });
}

export const initConnection = async (req, res) => {
  const code = req.body.code;
  if (code) {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      res.status(200).send(oAuth2Client);
    });
  }
}



