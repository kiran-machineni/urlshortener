const dns = require("dns")

const validateURL = urlString => {
	try {
		const parsedURL = new URL(urlString)
		const hostname = parsedURL.hostname
		return new Promise((resolve, reject) => {
			dns.lookup(hostname, err => {
				if (err) {
					resolve({ valid: false, error: "invalid url" })
				} else {
					resolve({ valid: true, host: hostname })
				}
			})
		})
	} catch (error) {
		return Promise.resolve({ valid: false, error: "invalid url" })
	}
}

module.exports = { validateURL }
