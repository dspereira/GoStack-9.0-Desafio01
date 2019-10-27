const express = require('express');
const server = express();

server.use(express.json());

const proj = [];
let reqCount = 0;

//Global middleware
server.use((req, res, next) => {
  console.log(`Number of request: ${++reqCount}`);
  return next();
});

//Middleware to verify if ID exists on proj[]
function CheckProjExists(req, res, next){
  const {id} = req.params;
  let message;
  
  for (i=0; i<proj.length; i++){
    if(proj[i].id == id){
      req.index = i;
      return next();
    }
  }
  message = proj.length === 0 ? 'Does not exist projects' : 'ID does not exist';
  return res.status(400).json({error: message});
}

//Middleware to verify if json has correct body fields
function CheckJsonBody(req, res, next){
  const {id} = req.params;

  if (!req.body.title && typeof id != 'undefined'){
    return res.status(400).json({error: 'title is required'});
  }
  else if ((!req.body.id || !req.body.title) && typeof id == 'undefined'){
    return res.status(400).json({error: 'id and title is required'});
  }

  return next();  
}

//Rote to get every project saved
server.get('/projects', (req, res) => {
  return res.json(proj);
});

//Rote to get a specific project
server.get('/projects/:id', CheckProjExists, (req, res) => {
  const {index} = req;

  return res.json(proj[index]);
});

//Rote to add projects
server.post('/projects', CheckJsonBody, (req, res) => {

  const obj = {
    id: req.body.id,
    title: req.body.title,
    task: []
  }
  proj.push(obj);

  return res.json(proj);
});

//Rote to add tasks to the project
server.post('/projects/:id/tasks', CheckJsonBody, CheckProjExists, (req, res) => {
  const {index} = req;
  const {title} = req.body;

  proj[index].task.push(title);

  return res.json(proj[index]);
});

//Rote to modify the project title
server.put('/projects/:id', CheckJsonBody, CheckProjExists, (req, res) => {
  const {index} = req;
  const {title} = req.body;

  proj[index].title = title;

  return res.json(proj[index]);
});

//Rote to delete project 
server.delete('/projects/:id', CheckProjExists, (req, res) => {
  const {index} = req;
  proj.splice(index, 1);
  return res.json(proj);
});

server.listen(3000);