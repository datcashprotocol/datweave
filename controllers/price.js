const axios = require('axios');

exports.uploadEstimate = (req, res) => {
	console.log('GET /price/:bytes')
	const bytes = req.originalUrl.split('/').at(-1) // TODO: make into a :bytes param in api/price.js
	
	axios.get(`https://arweave.net/price/${bytes}`)
	.catch((err) => {
		// if cannont reach, send back resp anyways. e.g. dev'ing locally.
		res.status(200).json({ data: 1 })
	})
	.then((price) => {
		if(price.hasOwnProperty('data')) {
			res.status(200).json({ data: price.data })
		}
	})
};