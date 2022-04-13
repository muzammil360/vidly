const mongoose = require('mongoose')

const schema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		minLength: 3,
		maxLength: 100
	}
})

const Genre = mongoose.model('genre', schema)
module.exports.GenreSchema = schema
module.exports.Genre = Genre
