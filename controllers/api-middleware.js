import { instance } from '../services/api-service.js'

export const getTeams = (req, res, next) => {
  let teamId = '';
  instance.get('/team').then(result => {
    teamId = result.data.teams[0].id;
    req.body = {...req.body, teamId};
    return next();
  }).catch(e => {
    console.log(e);
    return res.status(400).send({error: e});
  })
}