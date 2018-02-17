const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

let TestId;

const todos = [
    { text: 'First test todo' },
    { text: 'Second test todo' }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        return Todo.findOne().then((todo) => {
            TestId = todo._id.toHexString();
        })
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((req, res) => {
                expect(req.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text })
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it('should not create todo with invaild body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should return all the todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${TestId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 for invalid Id', (done) => {
        request(app)
            .get(`/todos/${TestId + 21}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        const randomId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${randomId}`)
            .expect(404)
            .end(done);
    });

});