const mongoose = require('mongoose');

//mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app');

module.exports.mongoose = mongoose;