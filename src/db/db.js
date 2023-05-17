const { MongoClient } = require("mongodb")

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const connectStr = process.env.MONGODB_CONNECTION_STRING
const mongoOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true
}

const insertURL = async url => {
	const client = new MongoClient(connectStr, mongoOptions)
	try {
		await client.connect()
		const coll = client.db("freecodecamp").collection("url_shortener")

		// Get the highest shortUrl number
		const highestNumberDoc = await coll.findOne({}, { sort: { shortUrl: -1 } })
		let highestNumber = 0
		if (highestNumberDoc) {
			highestNumber = highestNumberDoc.shortUrl
		}

		// Increment the highest shortUrl number by 1
		const newShortUrl = highestNumber + 1

		// Insert the new URL document with the incremented shortUrl number
		const insertDoc = { URL: url, shortUrl: newShortUrl }
		await coll.insertOne(insertDoc)
		return insertDoc
	} catch (error) {
		console.error("Error inserting URL:", error)
	} finally {
		client.close()
	}
}

const getURL = async shortUrlId => {
	const client = new MongoClient(connectStr, mongoOptions)
	try {
		await client.connect()
		const coll = client.db("freecodecamp").collection("url_shortener")
		const filter = { shortUrl: shortUrlId }
		const result = await coll.findOne(filter)
		return result
	} catch (error) {
		console.error("Error getting URL:", error)
		throw new Error(error)
	} finally {
		client.close()
	}
}

module.exports = { insertURL, getURL }
