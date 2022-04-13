const start = new Date() 


const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')

const genresRouter = require('./routes/genres')
const customerRouter = require('./routes/customers')
const movieRouter = require('./routes/movies')

const app = express()
app.use(express.json());
app.use(helmet());
app.use(morgan('tiny'));
app.use('/api/genres',genresRouter)
app.use('/api/customers',customerRouter)
app.use('/api/movies',movieRouter)



app.get('/', (req,res) => {
	res.send("Hello vidly from Muzammil")
})


const username = 'muz_default'
const pwd = 'XnfGCcOf0pTBQgHg'
const dbAddr = `mongodb+srv://${username}:${pwd}@cluster0.6de6a.mongodb.net/vidly?retryWrites=true&w=majority`
mongoose.connect(dbAddr)
	.then(() => { 
		console.log("connetion to db: success") 
		console.log(`elasped time since start: ${new Date() - start} ms`) 
	})
	.catch((err)=> { 
		console.log('error connecting to db')
		console.log(err.message) 
	}) 

app.listen(3003, () => {
		console.log(`startup time: ${new Date() - start} ms`)
		console.log('service is up ')
	})