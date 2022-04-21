const request = require('supertest')
const app = require('../server')
const payload = require('./data/transaction.json')
const utils = require('../utils')

const address = utils.randomString(10)

/*
The order of tests follows the order in which the Arweave js framework calls endpoints
1. /wallet
2. /mint
3. /price
4. /tx_anchor
5. /get_price
6. /uploadChunk
7. /tx
8. /mine

Example sequence
GET /mint
GET /wallet/:param/balance
GET /price/145479
GET /tx_anchor
GET /price/291808
POST /tx
POST /chunk
POST /chunk
GET /:txnID/status
POST /wallet/dat
GET /dat/:txnID
GET /:txnID/offset
GET /chunk
GET /chunk
GET /chunk
GET /:txnID/status
*/
describe('datweave API', () => {
	it('POST /wallet/clear -> 200', () => {
		return request(app)
			.post('/wallet/clear')
			.expect(200)
	});
	
	it('POST /tx/clear -> 200', () => {
		return request(app)
			.post('/tx/clear')
			.expect(200)
	});

	// Should fail to get a wallet balance until wallet is created 
	// on call to /mint
	it('GET /wallet -> 404', () => {
		return request(app)
			.get(`/wallet/${utils.randomString(10)}/balance`)
			.expect(404)
	})

	// // Create wallet and for updating winstons
	it('GET /mint -> 200', () => {
		const winstons = 123

		return request(app)
			.get(`/mint/${address}/${winstons}`)
			.expect(200)
	})

	// After calling /mint, should be able to get the balance
	it('GET /wallet -> 10000 winstons', () => {
		return request(app)
			.get(`/wallet/${address}/balance`)
			.expect(200)
			.then((resp) => {
				expect(resp.body).toEqual('123')
			})
	})

	// User enters new data and wallet calls /price to get
	// updated cost estimate
	it('GET /price -> 200', () => {
		const byte = 100
		return request(app)
			.get(`/price/${byte}`)
			.expect(200)
			.then((resp) => {
				expect(resp.body).not.toBeNaN()
			})
	});
	
	// Get the last transaction, if first txn, then insert before returning
	it('GET /tx_anchor -> 200', () => {
		return request(app)
			.get(`/tx_anchor`)
			.expect(200)
	})

	// Call /price again to simulate entire process. Should pass.
	it('GET /price -> 200', () => {
		const byte = 100
		return request(app)
			.get(`/price/${byte}`)
			.expect(200)
			.then((resp) => {
				expect(resp.body).not.toBeNaN()
			})
	});

	// Nothing in db yet, so should expect 404
	it('POST /chunk --> 404 #chunk 1', () => {
		return request(app)
			.post('/chunk')
			.send({
				data_root: 'data_root',
				chunk: 'chunk1',
				offset: 1
			})
			.expect(404)
	});

	// TODO: Test for one chunk of max size
	it('POST /tx -> 200', () => {
		return request(app)
			.post('/tx')
			.send({
				id: 'id',
				data_root: 'data_root',
				owner: 'owner',
				data: 'data'
			})
			.expect(200)
	});

	// TODO: Test multiple chunks that succeeed
	// it('POST /tx -> 200', () => {
	// 	return request(app)
	// });

	
	// TODO: Multiple mints in wallet transactions


	it('POST /chunk --> 200 #chunk 2', () => {
		return request(app)
			.post('/chunk')
			.send({
				data_root: 'data_root',
				chunk: 'chunk2',
				offset: 2
			})
			.expect(200)
	});

	it('GET /chunk --> 404', () => {
		return request(app)
			.get('/chunk')
			.query({
				id: '0xNonExistentAddress',
				offset: '291957'
			})
			.expect(404)
	});

	it('GET /tx/:txnID/status -> 200', () => {
		const txnID = 'id'
		return request(app)
			.get(`/tx/${txnID}/status`)
			.expect(200)
	});

	it('POST /wallet/dat -> ', () => {
		return request(app)
			.post(`/wallet/dat?txnID=id&address=${address}`)
			.expect(200)
	})

	it('GET /mine --> 200 [not implemented]', () => {
		return request(app)
			.get('/mine')
			.expect(200)
	});


});