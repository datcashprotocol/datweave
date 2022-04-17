# datweave
Minimalist backend simulation for developing on Arweave

Transactions are cached and should be retrieved whenever displaying contents of a wallet.

### TODO
1. Upload locally without spl creation
2. Download locally without spl creation

### Installation
1. In the root directory: `npm install`
2. Install MongoDb
3. Open a terminal and start the MongoDB daemon

For OSX
```
brew services start mongodb-community@5.0

mongosh
```

4. In a separate terminal run `npm run dev`


### Setup
Create `.env` in root with parameters

`touch .env`

Example parameters
```
PORT=1984
LIMIT=50mb
MODE=test
```

`MODE=dev` is for developing datweave
`MODE=test` is for testing datweave

### Mongo shell commands

Show databases
```
show dbs
```

Display all records from collection
```
show dbs
use <dbs name>
show collections
db.<collection name>.find({})
```

Find a record and ignore `chunk` property
```
db.transactions.find({id: "4Z7FstvUq4JExe-KpvEJbORt3VoVyr5cCTeTBbX0-Lk"}, {chunk:0}).pretty()
```

Examine a specific chunk
```
db.transactions.find({id: "4Z7FstvUq4JExe-KpvEJbORt3VoVyr5cCTeTBbX0-Lk"}, {chunk: "145978"}).pretty()
```

Count documents
```
db.transactions.countDocuments()
```

Delete one document
e.g.
```
db.wallets.deleteOne({_id: ObjectId("623cc2c2c032fde16a31aeb5")})
```

Delete all documents
```
db.transactions.deleteMany({})
```

Export record to file
```
mongoexport --db datweave --collection wallets --out wallets.json
```

### Run dev
`npm run dev`


### Example usage

Store data
```
```

Retrieve data
```
```