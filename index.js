
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());

morgan.token('body', function (req, res) {return JSON.stringify(req.body)});

app.use(express.static('build'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'});
  }

  next(error);
}

const unknownEndpont = (request, response) => {
  response.status(404).send({ error: 'unkown endpoint'});
}


app.get('/', (request, response) =>{
    response.send('<h1>This is the root!</h1>');
});


app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons);
    })
});


app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (!body.name){
    return response.status(400).json({
      error: 'content missing'
    })
  } else if (!body.number){
    return response.status(400).json({
      error: 'Content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });
  
  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
  .catch(error => next(error));
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findOneAndUpdate({name: person.name}, {number: person.number}, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
      response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error =>{
      response.status(500).end();
    })
});

app.use(unknownEndpont);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
