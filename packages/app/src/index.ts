import Debug from "debug";
import * as mongodb from "@bored/mongodb";

import env from "./env";
import server from "./express";
import bastion from "./bot";

const debug = Debug("bored-bot");

// middleware to add reference to bastion to [req]
// todo: make this typed somehow maybe
server.use((req, res, next) => {
  // @ts-ignore
  req.bastion = bastion
  next()
})

debug("begin connecting to mongodb?")
mongodb.connect(env.MONGO_URL);
// Start the bot
bastion.start(client => debug(`Connected to discord, ${client.user.tag}`));
// Start the web server
server.listen(env.HTTP_PORT, () => debug(`Web server running on port ${env.HTTP_PORT}`));