const mongoose = require('mongoose');
const { client } = require('./client');

module.exports = { connection: mongoose.connect(client.config.mongoURL) };