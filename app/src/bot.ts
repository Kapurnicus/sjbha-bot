import {Bastion} from "@bored/bastion";
// import {restrict} from "@bored/bastion-toolkit";
import env from "./env";
import server from "./express";
import Channels from "./channels";

const bastion = new Bastion({
  token: env.DISCORD_TOKEN,
  instigator: "!"
});

const channels = env.NODE_ENV === "development" ? Channels.development : Channels.production;

import ping from "@commands/ping";
bastion.use("ping", ping);


import * as fit from "@commands/fit";
fit.config({
  basePath: env.HOSTNAME + "/fit",
  client_id: env.STRAVA_CLIENT_ID,
  client_secret: env.STRAVA_CLIENT_SECRET,
  post_to_channel: channels.strava
})
server.use("/fit", fit.router);
bastion.use("fit", fit.command);

export default bastion;