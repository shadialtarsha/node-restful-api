const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

let testId;
let testCompleted;
let testCompletedAt;

const todos = [
    { text: 'First test todo' },
    { text: 'Second test todo' }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        return Todo.findOne().then((todo) => {
            testId = todo._id.toHexString();
            testCompleted = todo.completed;
            testCompletedAt = todo.completedAt;
        })
    }).then(() => done());
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

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
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

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${testId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if id is invalid', (done) => {
        request(app)
            .get(`/todos/${testId + 21}`)
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

describe('DELETE /todos/:id', () => {
    it('should delete todo doc', (done) => {
        request(app)
            .delete(`/todos/${testId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(testId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should return 404 if todo not found', (done) => {
        const randomId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${randomId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is invalid', (done) => {
        request(app)
            .delete(`/todos/${testId + 21}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update todo doc', (done) => {
        const text = 'new text';
        request(app)
            .patch(`/todos/${testId}`)
            .send({ text, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        request(app)
            .patch(`/todos/${testId}`)
            .send({ text: 'new text!!!', completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toNotBe(todos[0].text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});