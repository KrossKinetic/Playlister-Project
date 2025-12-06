const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const songSchema = new Schema(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        year: { type: Number },
        youTubeId: { type: String },
        listens: { type: Number, required: true },
        created_by: { type: String, required: true },
        duration: { type: String }
    },
    { timestamps: true },
)

module.exports = mongoose.model('Song', songSchema)