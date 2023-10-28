// const mongoose = require("mongoose");
// const Joi = require('joi');
// const ObjectId = mongoose.Schema.Types.ObjectId;


// const playlistSchema = mongoose.Schema({
//     name: { type: String, required: true },
//     user: { type: ObjectId, ref: "user", required: true },
//     desc: { type: String },
//     songs: { type: Array, default: [] },
//     img: { type: String },
// })

// const validate = (playlist) => {
//     const schema = Joi.object({
//         name: Joi.string().required(),
//         user: Joi.string().required(),
//         desc: Joi.string().allow(""),
//         songs: Joi.array().items(Joi.string()),
//         img: Joi.string().allow(""),
//     });
//     return schema.validate(playlist);
// }

// const PlaylistModel = mongoose.model("playlist", playlistSchema);

// module.exports = {PlaylistModel, validate};

const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema(
	{
		playlistId: {
			type: String,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		// userId: {
		// 	type: String,
		// 	required: true,
		// },
		username: {
			type: String,
			required: true,
		},
		songs: {
			type: Array,
			default: [],
		},
		isPrivate: {
			type: Boolean,
			required: true,
			default: true,
		},
		type: {
			type: String,
			required: true,
			default: "Playlist",
		},
	},
	{ timestamps: true }
);

const Playlist = mongoose.model("Playlist", PlaylistSchema);
module.exports = Playlist;
