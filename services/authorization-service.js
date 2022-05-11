import { google } from "googleapis";
import {oAuth2Client} from "../consts /consts.js";



export const readCredentials = (body) => {
    createSpreadSheet(oAuth2Client, body);
}

const divideTasksToGroupsByListName = (values) => {
    return values.data.reduce((previousItem, currentItem) => {
      if (!previousItem[currentItem.list.name]) {
        previousItem[currentItem.list.name] = [];
      }
      previousItem[currentItem.list.name].push(currentItem);
      return previousItem;
    }, {});
}

const updateSpreadSheet = (spreadsheetId, group, auth) => {
  const sheets = google.sheets({ version: 'v4', auth } );
  // create array for google sheet row from values received
  const forSaveArr = group.map((i) => [
    i.name,
    i.description || 'null',
    i.status,
    new Date(Number(i.date_created)),
    i.creator,
    i.assignees.length? i.assignees[0] : 'null',
    i.task_comments?.text || 'null',
    i.task_comments?.date? new Date(Number(i.task_comments?.date)) : 'null',
    i.url
  ]);

  const body = {
    data: [{ range: 'Sheet1!A1', values: [
      ['task name', 'description', 'status', 'date created', 'creator', 'assignee', 'last comment', 'last comment date', 'task url'], ...forSaveArr]}
    ],
    valueInputOption: 'USER_ENTERED',
  };

  sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    resource: body,
  }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('%d cells updated.', result);
    }
  });
}

const createSpreadSheet = (auth, values) => {
  const sheets = google.sheets({ version: 'v4', auth } );
  const groups = divideTasksToGroupsByListName(values);

  for (let [key, group] of Object.entries(groups)) {
    const requestBody = {
      properties: {
        title: key
      },
    };

    sheets.spreadsheets.create({
      requestBody,
      fields: 'spreadsheetId'
    }, (err, spreadsheet) => {
      if (err) {
        console.log(err);
      } else {
        const spreadsheetId = spreadsheet.data.spreadsheetId;
        updateSpreadSheet(spreadsheetId, group, auth);
      }
    });
  }
}