const mongoose = require('mongoose')

const schema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 5,
		maxLength: 100
	},
	isGold: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String,
		required: true,
		minLength: 5,
		maxLength: 100
	}
})

const Customer = mongoose.model('customer', schema)
module.exports = Customer
