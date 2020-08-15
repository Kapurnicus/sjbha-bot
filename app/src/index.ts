import Debug from "debug";
import * as mongodb from "@bored/mongodb";

import env from "./env";
import server from "./express";

const debug = Debug("bored-bot");

// middleware to add reference to bastion to [req]
// todo: make this typed somehow maybe
server.use((req, res, next) => {
  //@ts-ignore
  req.bastion = bastion

  console.log("server.use?");
  next()
})

import bastion from "./bot";

mongodb.connect(env.MONGO_URL);
// Start the bot
bastion.start(client => debug(`Connected to discord, ${client.user.tag}`));
// Start the web server
server.listen(env.HTTP_PORT, () => debug(`Web server running on port ${env.HTTP_PORT}`));