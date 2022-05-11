import axios from "axios";
import * as dotenv from 'dotenv';
dotenv.config();

const SECOND_AND_THIRD_OBJECT_LAYER_FIELDS = {
  PRIORITY: 'priority',
  TASK_COMMENTS: 'task_comments',
  CREATOR: 'creator',
  STATUS: 'status',
  CHECKLISTS: 'checklists',
  ASSIGNEES: 'assignees'
};

const headers = {
  Authorization: process.env.CLICK_UP_TOKEN,
  'Content-Type': 'application/json'
};

const clickUpUrl = process.env.CLICK_UP_URL;

export const instance = axios.create({
  baseURL: clickUpUrl,
  headers
});

const convertThirdLayerOfObject = (keyOfObject, element) => {
  if (keyOfObject === SECOND_AND_THIRD_OBJECT_LAYER_FIELDS.CHECKLISTS) {
    element = {
      name: element.name,
      items: element.items.map(item => item.name)
    };
  }
  if (keyOfObject === SECOND_AND_THIRD_OBJECT_LAYER_FIELDS.ASSIGNEES) {
    element = `${element.username} (${element.email})`;
  }
  return element;
}

const convertSecondLayerOfObject = (keyOfObject, object) => {
  if (object) {
    if (keyOfObject === SECOND_AND_THIRD_OBJECT_LAYER_FIELDS.STATUS) {
      object = object.status;
    }
    if (keyOfObject === SECOND_AND_THIRD_OBJECT_LAYER_FIELDS.CREATOR) {
      object = `${object.username} (${object.email})`;
    }
    if (keyOfObject === SECOND_AND_THIRD_OBJECT_LAYER_FIELDS.TASK_COMMENTS) {
      object = { text: `${object.comment_text}by ${object.user.username} (${object.user.email})`, date: object.date };
    }
    if (keyOfObject === SECOND_AND_THIRD_OBJECT_LAYER_FIELDS.PRIORITY) {
      object = object.priority;
    }
    if (Array.isArray(object)) {
      object = object.map(element => {
        element = convertThirdLayerOfObject(keyOfObject, element);
        return element;
      })
    }
  }

  return object;
}

const createTaskObject = (task) => {
  let taskObject = {};
  // fields to include in taskObject
  const fields = [
    'id',
    'name',
    'text_content',
    'description',
    'list',
    'space',
    'status',
    'date_created',
    'date_updated',
    'date_closed',
    'creator',
    'assignees',
    'priority',
    'due_date',
    'start_date',
    'time_estimate',
    'url',
    'task_comments'
  ];
  for (let key in task) {
    if (fields.includes(key)) {
      taskObject[key] = task[key];
        taskObject[key] = convertSecondLayerOfObject(key, task[key]);
    }
  }
  return taskObject;
}

export const cleanObjectFields = (task) => {
  task = createTaskObject(task);
  return task;
}

