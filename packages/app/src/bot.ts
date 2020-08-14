import {Bastion} from "@bored/bastion";
// import {restrict} from "@bored/bastion-toolkit";
import env from "./env";
import server from "./express";

const bastion = new Bastion({
  token: env.DISCORD_TOKEN,
  instigator: "!"
});


import ping from "@commands/ping";
bastion.use("ping", ping);


import * as fit from "@commands/fit";
fit.config({
  basePath: env.HOSTNAME + "/fit",
  client_id: env.STRAVA_CLIENT_ID,
  client_secret: env.STRAVA_CLIENT_SECRET
})
server.use("/fit", fit.router);
bastion.use("fit", fit.command);

export default bastion;