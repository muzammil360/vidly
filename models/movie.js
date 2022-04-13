const mongoose = require('mongoose')

const { GenreSchema } = require('./genre')

const schema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		minLength: 3,
		maxLength: 100
	},
	genre : {
		type: GenreSchema,
		required: true
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 1000*1000
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 1000*1000		
	}
})

const Movie = mongoose.model('movie', schema)

module.exports = Movie
