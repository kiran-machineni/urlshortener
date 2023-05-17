const dns = require("dns")

const validateURL = async urlString => {
	try {
		const parsedURL = new URL(urlString)
		const hostname = parsedURL.hostname
		console.log("hostname: ", hostname)
		const lookupPromise = new Promise((resolve, reject) => {
			dns.lookup(hostname, err => {
				if (err) {
					console.error(err)
					resolve({ valid: false, error: "Invalid Hostname" })
				} else {
					resolve({ valid: true, host: hostname })
				}
			})
		})
		return await lookupPromise
	} catch (error) {
		console.error(error)
		return { valid: false, error: "Invalid URL" }
	}
}

module.exports = { validateURL }
