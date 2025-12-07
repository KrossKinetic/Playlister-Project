const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
        listeners_user: [{ type: String }],
        lastAccessed: { type: Date, default: Date.now },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
