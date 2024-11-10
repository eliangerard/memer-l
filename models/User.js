const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true,
        trim: true,
    },
    spotifyRefresh: {
        type: String,
        trim: true,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;