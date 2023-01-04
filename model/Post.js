const mongoose = require('mongoose')

const post = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
},
    {
        timestamps: true        // Automatically gives us a createdAt and updatedAt fields
    }
)

module.exports = mongoose.model("Post", post)