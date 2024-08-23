const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
app.use(morgan('tiny'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date();
  const contentInfo = `<p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTime}</p>`;

  response.send(contentInfo);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  return response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const nameExist = persons.some((person) => person.name === body.name);
  if (nameExist) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const newPersonAdded = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(newPersonAdded);
  response.json(newPersonAdded);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
