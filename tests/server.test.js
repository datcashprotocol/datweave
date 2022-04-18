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
*/
describe('datweave API', () => {
	beforeAll(() => {
		request(app)
		.post('/wallet/clear')
		.expect(200)
		
		request(app)
		.post('/tx/clear')
		.expect(200)
		return
	});

	afterAll(() => {
		request(app)
		.post('/wallet/clear')
		.expect(200)
		
		request(app)
		.post('/tx/clear')
		.expect(200)
		return
	});

	it('GET /wallet -> 404', () => {
		return request(app)
			.get(`/wallet/${utils.randomString(10)}/balance`)
			.expect(404)
	})

	it('GET /mint -> 200', () => {
		const winstons = 123

		return request(app)
			.get(`/mint/${address}/${winstons}`)
			.expect(200)
	})

	it('GET /wallet -> 10000 winstons', () => {
		return request(app)
			.get(`/wallet/${address}/balance`)
			.expect(200)
			.then((resp) => {
				expect(resp.body).toEqual('123')
			})
	})
	
	it('GET /wallet/:param/last_tx -> 200', () => {
		return request(app)
			.get(`/wallet/${address}/last_tx`)
			.expect(200)
	})

	it('GET /price -> 200', () => {
		const byte = 100
		return request(app)
			.get(`/price/${byte}`)
			.expect(200)
			.then((resp) => {
				expect(resp.body).not.toBeNaN()
			})
	});

	it('GET /tx_anchor -> 200', () => {
		return request(app)
			.get(`/tx_anchor`)
			.expect(200)
	})

	// Nothing in db yet, so should expect 404
	it('POST /chunk --> 200 #chunk 1', () => {
		return request(app)
			.post('/chunk')
			.send({
				data_root: 'data_root',
				chunk: 'chunk1',
				offset: 1
			})
			.expect(404)
	});

	it('POST /chunk --> 200 #chunk 2', () => {
		return request(app)
			.post('/chunk')
			.send({
				data_root: 'data_root',
				chunk: 'chunk2',
				offset: 2
			})
			.expect(404)
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

	it('GET /mine --> 200 [not implemented]', () => {
		return request(app)
			.get('/mine')
			.expect(200)
	});


});