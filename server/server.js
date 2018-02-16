const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/todos', (req, res) => {
    Todo.create(req.body)
        .then((todo) => {
            res.json(todo);
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});