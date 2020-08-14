import {MongoClient} from "mongodb";
import Debug from "debug";

const debug = Debug("mongodb");

class Instance {
  static client: MongoClient;
}

export function connect(url: string) {
  MongoClient
    .connect(url, { useUnifiedTopology: true })
    .then(r => Instance.client = r)
    .then(() => debug(`Connected to MongoDB client`));
}

export function getCollection(collection: string) {
  if (!Instance.client) throw new Error(`Trying to call 'getCollection' on @bored/mongodb, but 'connect()' hasn'et been called from the app yet`)
  return Instance.client.db().collection(collection);
}