const mongoose = require("mongoose")

// Define the schema for the URL collection
const urlSchema = new mongoose.Schema({
	URL: {
		type: String,
		required: true
	},
	shortUrl: {
		type: Number,
		required: true
	}
})

// Create a model for the URL collection
const URLModel = mongoose.model("URL", urlSchema)

// Connect to MongoDB using the Mongoose connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

const insertURL = async url => {
	try {
		const highestNumberDoc = await URLModel.findOne(
			{},
			{ shortUrl: 1 },
			{ sort: { shortUrl: -1 } }
		)
		let highestNumber = 0
		if (highestNumberDoc) {
			highestNumber = highestNumberDoc.shortUrl
		}
		const newShortUrl = highestNumber + 1
		const insertDoc = { URL: url, shortUrl: newShortUrl }
		const result = await URLModel.create(insertDoc)
		return result
	} catch (error) {
		console.error("Error inserting URL:", error)
		throw error
	}
}

const getURL = async shortUrlId => {
	try {
		const result = await URLModel.findOne({ shortUrl: shortUrlId })
		return result
	} catch (error) {
		console.error("Error getting URL:", error)
		throw error
	}
}

module.exports = { insertURL, getURL }
