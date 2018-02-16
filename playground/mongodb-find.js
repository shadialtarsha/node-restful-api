const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to Mongodb server');
    }

    const db = client.db('TodoApp');

    // db.collection('Todos')
    //     .find(ObjectId.createFromHexString("5a86b609f1e42102e4bbf4be"))
    //     .toArray()
    //     .then((documents) => {
    //         console.log(JSON.stringify(documents, undefined, 2));
    //     })
    //     .catch((err) => {
    //         console.log('Unable to fetch todos', err);
    //     });

    db.collection('Todos')
        .find()
        .count()
        .then((count) => {
            console.log(`Todos count: ${count}`);
        })
        .catch((err) => {
            console.log('Unable to fetch todos', err);
        });
    client.close();
});