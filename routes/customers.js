const express = require('express')
const Joi = require('joi')
const Customer = require('./../models/customer')

const router = express.Router()



const customerSchema = Joi.object({
	name: Joi.string().min(5).max(100).required(),
	isGold: Joi.boolean().default(false),
	phone: Joi.string().min(5).max(100).required()
})



router.get('/', async (req,res) => {
	try {
		// TODO: throw error if auth to db fails
		const results = await Customer.find()
		res.send(results)
	} catch (err) {
		console.log(err.message)
		return res.status(500).send('error reading genre from db')
	}

})


router.get('/:id', async (req,res) => {
	// get id

	// if course doesn't exist, return 404
	try {
		const id = req.params.id
		const result = await Customer.findById(id)
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
	const { error, value } = validateCustomer(req.body)
	if (error) {
		return res.status(400).send(error.details[0].message)
	}

	const customer = new Customer({
		name: value.name,
		isGold: value.isGold,
		phone: value.phone
	})

	// add it
	try{
		const objNew = await customer.save()
		return res.send(objNew)
	} catch (err) {
		console.log('error adding resource to db')
		console.log(err.message)
		return res.status(500).send('error adding resource to db')
	}


})


router.put('/:id', async (req,res) => {

	// validate input
	const { error, value } = validateCustomer(req.body)
	if (error) {
		return res.status(400).send(error.details[0].message)
	}


	// find object and update it
	const id = req.params.id
	const newObj = {
		name: value.name,
		isGold: value.isGold,
		phone: value.phone
	}
	const options = {new: true}

	try {
		const result = await Customer.findByIdAndUpdate(id,newObj,options)
		return res.send(result)
	}
	catch (err) {
		console.log(err.message)
		return res.status(404).send('failed to updated object with requested id')
	}



})

router.delete('/:id', async (req, res) => {
	// check if requested resource exist

	const id = req.params.id
	try {
		const result = await Customer.findByIdAndRemove(id)
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

const validateCustomer = (obj) => {
	return customerSchema.validate(obj)
}

module.exports = router