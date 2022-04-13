
const express = require('express')
const Joi = require('joi')

const { Genre } = require('./../models/genre')

const router = express.Router()


const genreSchema = Joi.object({
	title: Joi.string().min(3).max(100).required()
})

// get genres list
router.get('/', async (req,res) => {
	try {
		// TODO: throw error if auth to db fails
		const results = await Genre.find()
		res.send(results)
	} catch (err) {
		console.log(err.message)
		return res.status(500).send('error reading genre from db')
	}

})

// get genres details
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

// add new genres
router.post('/', async (req,res) => {


	// validate the incoming  object
	const { error, value } = validateGenre(req.body)
	if (error) {
		return res.status(400).send(error.details[0].message)
	}

	const genre = new Genre({
		title: value.title
	})

	// add it
	try{
		const genreNew = await genre.save()
		return res.send(genre)
	} catch (err) {
		console.log('error adding genre to db')
		console.log(err.message)
		return res.status(500).send('error adding genre from db')
	}


})

// update genres
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

// delete genres
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

 
const validateGenre = (genre) => {
	return genreSchema.validate(genre)
}

module.exports = router