require("dotenv").config()

const express = require("express")
const { validateURL } = require("./util/validateURL")
const { insertURL, getURL } = require("./db/db")

const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use("/public", express.static(`${process.cwd()}/src/public`))

app.get("/", function (req, res) {
	res.sendFile(process.cwd() + "/src/views/index.html")
})

app.get("/api/hello", function (req, res) {
	res.json({ greeting: "hello API" })
})

app.post("/api/shorturl", async function (req, res) {
	try {
		const url = req.body.url
		const result = await validateURL(url)

		if (result.valid) {
			const insertResult = await insertURL(url)
			res.json({
				original_url: url,
				short_url: insertResult.shortUrl
			})
		} else {
			res.json({ error: result.error })
		}
	} catch (error) {
		console.error("Error:", error)
		res.json({ error: error })
	}
})

app.get("/api/shorturl/:shortUrlId", async function (req, res) {
	try {
		const shortUrlId = parseInt(req.params.shortUrlId)
		const result = await getURL(shortUrlId)
		console.log(result)
		if (result === null) {
			res.status(200).json({ error: "No short URL found for the given input" })
		} else {
			res.redirect(301, result.URL)
		}
	} catch (err) {
		console.error(err)
		res.status(500).send({ error: err })
	}
})

app.listen(port, function () {
	console.log(`Listening on port ${port}`)
})
