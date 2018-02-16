const { ObjectID } = require('mongodb');
const { monogoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

const todoId = '5a872cfc4143cf2c2953f732';

if (!ObjectID.isValid(todoId)) {
    console.log('Id not valid');
} else {

    // Todo.find({ _id: id }).then((todo) => {
    //     console.log('Todo', todo);
    // });

    // Todo.findOne({ completed: false }).then((todo) => {
    //     console.log('Todo one', todo);
    // });

    Todo.findById(todoId).then((todo) => {
        if (!todo) {
            return console.log('Id not found');
        }
        console.log('Todo by id', todo);
    }).catch((err) => console.log(err));
}

const userId = '5a87327edfc3fe045ca5b416';

if (!ObjectID.isValid(userId)) {
    console.log('Id not valid');
} else {
    User.findById(userId).then((user) => {
        if (!user) {
            return console.log('Id not found');
        }
        console.log('User by id', user);
    }).catch((err) => console.log(err));
}