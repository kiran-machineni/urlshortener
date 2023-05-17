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
	// 	const client = new MongoClient(connectStr, mongoOptions)
	// try {
	// 	await client.connect()
	// 	const coll = client.db("freecodecamp").collection("url_shortener")
	// 	await coll.insertOne({ URL: url, shortUrl: 1010 })
	// } catch (error) {
	// 	console.error("Error inserting URL:", error)
	// } finally {
	// 	client.close()
	// }
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
		throw { status: 500, message: error }
	} finally {
		client.close()
	}
}

module.exports = { insertURL, getURL }
