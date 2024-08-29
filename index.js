const express = require("express");
const app = express();
app.use(express.json());
const morgan = require("morgan");
app.use(morgan("tiny"));
const cors = require("cors");
app.use(cors());
require("dotenv").config();

const Person = require("./models/person");

app.use(express.static("build"));

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Route pour obtenir toutes les personnes
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Route pour obtenir des informations générales
app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    const currentTime = new Date();
    const contentInfo = `<p>Phonebook has info for ${count} people</p>
      <p>${currentTime}</p>`;
    response.send(contentInfo);
  });
});

// Route pour obtenir une personne par ID
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// Route pour supprimer une personne par ID
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      console.error(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

// Route pour mettre à jour les informations d'une personne
app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;

  const person = {
    name,
    number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});
// Route pour ajouter une nouvelle personne
app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
