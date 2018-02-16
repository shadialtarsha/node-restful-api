const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to Mongodb server');
    }

    const db = client.db('TodoApp');

    db.collection('Todos')
        .findOneAndUpdate(ObjectId.createFromHexString('5a86c5a7dfc3fe045ca5b415'), {
            $set: {
                completed: false
            }
        }, { returnOriginal: false })
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log('Unable to delete data', err);
        });
    client.close();
});