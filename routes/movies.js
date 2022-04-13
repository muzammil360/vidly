
const express = require('express')
const Joi = require('joi')

const Movie = require('./../models/movie')
const { Genre } = require('./../models/genre')


const router = express.Router()

const movieSchema = Joi.object({
	title: Joi.string().min(3).max(100).required(),
	genre: Joi.string().min(3).max(100).required(),
	numberInStock: Joi.number().required(),
	dailyRentalRate: Joi.number().required()
})

const Model = Movie

router.get('/', async (req,res) => {
	try {
		// TODO: throw error if auth to db fails
		const results = await Model.find()
		res.send(results)
	} catch (err) {
		console.log(err.message)
		return res.status(500).send('error reading document from db')
	}

})

router.get('/:id', async (req,res) => {
	// get id

	// if course doesn't exist, return 404
	// genre = genres.find( item => item.id === genreId )
	try {
		const genreId = req.params.id
		const result = await Genre.findById(genreId)
		if (!result) {
			return res.status(404).send('unable to find resource with given id')
		}

		return res.send(result)
	}
	catch (err) {
		console.log(err.message)
		return res.status(500).send('error reading genre from db')
	}
})


router.post('/', async (req,res) => {


	// validate the incoming  object
	const { error, value } = validateMovie(req.body)
	if (error) {
		return res.status(400).send(error.details[0].message)
	}

	// find the genre
	let genreDB = undefined
	try {
		genreDB = await Genre.find({title: req.body.genre})

		if (genreDB.length!==1) {
			throw new Error('requested genre does not exist')
		}
		console.log(genreDB)
	}
	catch (err) {
		console.log(err)
		return res.status(400).send(err.message)
	}

	const doc = new Model({
		title: value.title,
		genre: {
			_id: genreDB._id,
			title: req.body.genre
		},
		numberInStock: value.numberInStock,
		dailyRentalRate: value.dailyRentalRate
	})

	// add it
	try{
		const docNew = await doc.save()
		return res.send(doc)
	} catch (err) {
		console.log('error adding document to db')
		console.log(err.message)
		return res.status(500).send('error adding doc to db')
	}


})

// not updated
router.put('/:id', async (req,res) => {

	// validate input
	const { error, value } = validateGenre(req.body)
	if (error) {
		return res.status(400).send(error.details[0].message)
	}


	// find object and update it
	const id = req.params.id
	const newObj = { title: value.title }
	const options = {new: true}

	try {
		const result = await Genre.findByIdAndUpdate(id,newObj,options)
		return res.send(result)
	}
	catch (err) {
		console.log(err.message)
		return res.status(404).send('failed to updated object with requested id')
	}



})

// not updated
router.delete('/:id', async (req, res) => {
	// check if requested resource exist

	const id = req.params.id
	try {
		const result = await Genre.findByIdAndRemove(id)
		if (!result){
			return res.status(404).send('unable to find resource with given id')
		}
		return res.send(result)		
	}
	catch (err) {
		console.log(err.message)
		return res.status(500).send('failed to delete resource with given id')
	}


})

 
const validateMovie = (x) => {
	return movieSchema.validate(x)
}

module.exports = router