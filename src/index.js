require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const { validateURL } = require("./util/validateURL")
const { insertURL, getURL } = require("./db/db")

const app = express()
const { PORT = 3000 } = process.env

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use("/public", express.static(`${process.cwd()}/src/public`))

app.get("/", (req, res) => {
	res.sendFile(process.cwd() + "/src/views/index.html")
})

app.get("/api/hello", (req, res) => {
	res.json({ greeting: "hello API" })
})

app.post("/api/shorturl", async (req, res) => {
	try {
		const { url } = req.body
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
		res.json({ error })
	}
})

app.get("/api/shorturl/:shortUrlId", async (req, res) => {
	try {
		const shortUrlId = parseInt(req.params.shortUrlId)
		const result = await getURL(shortUrlId)
		if (result === null) {
			res.json({ error: "No short URL found for the given input" })
		} else {
			res.redirect(result.URL)
		}
	} catch (err) {
		res.status(500).send({ error: err })
	}
})

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})
