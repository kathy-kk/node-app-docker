const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'User name must be unique'],
        require: [true, 'User must have name'],
    },
    password: {
        type: String,
        required: [true, 'User must have password']
    },
    email: {
        type: String,
        unique: [true, 'User email must be unique'],
        required: [true, 'User must have email']
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User