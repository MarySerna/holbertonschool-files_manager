const { MongoClient } = require('mongodb');

/** DBclient - A MongoDB client class */
class DBclient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}/`;

    this.client = null;
    // Creating a connection to mongodb, saving dabase client to this.client
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
      if (err) this.client = false;
      else {
        this.client = db.db(database);
        this.client.createCollection('users');
        this.client.createCollection('files');
      }
    });
  }

  isAlive() {
    return !!this.client; // this.client ? true : false;
  }

  async nbUsers() {
    const numDocs = await this.client.collection('users').estimatedDocumentCount({});
    return numDocs;
  }

  async nbFiles() {
    const numDocs = await this.client.collection('files').estimatedDocumentCount({});
    return numDocs;
  }
}

const dbClient = new DBclient();
module.exports = dbClient;
