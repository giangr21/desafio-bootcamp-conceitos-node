const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }
  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  if (isUuid(id)) {
    const i = repositories.findIndex(r => r.id === id);
    if (i >= 0) {
      repositories[i].title = title
      repositories[i].url = url
      repositories[i].techs = techs
      return response.json(repositories[i]);
    }
    return response.status(400).json({ Error: 'Repositories not found' })
  } else {
    return response.status(400).json({ error: 'Invalid ID' })
  }
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params
  if (isUuid(id)) {
    const i = repositories.findIndex(r => r.id === id);
    if (i < 0) {
      return res.status(400).json({ Error: 'Repositories not found' })
    }
    repositories.splice(i, 1)
    return res.status(204).send();
  } else {
    return res.status(400).json({ error: 'Invalid ID' })
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  if (isUuid(id)) {
    const i = repositories.findIndex(r => r.id === id);
    if (i >= 0) {
      repositories[i].likes += 1
      return response.json(repositories[i])
    }
    return response.status(400).json({ Error: 'Repositories not found' })
  } else {
    return response.status(400).json({ error: 'Invalid ID' })
  }
});

module.exports = app;
