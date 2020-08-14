import {Request, Response} from "@bored/bastion";
import {MessageEmbed} from "discord.js";
import * as querystring from "querystring";
import AuthService from "./services/Authorization";
import config from "./config";


/**
 * Provide a list of the available commands
 */
export async function help(req: Request, res: Response) {
  res.reply(`\/\/TODO: help text>`);
}


/**
 * Setup the user with an account and DM them the link so they can authenticate with the strava API
 */
export async function auth(req: Request, res: Response) {
  const discordId = req.author.id;
  const auth = new AuthService();
  
  const user = await auth.initializeUser(discordId);
  const url = config.basePath + "/connect?" + querystring.stringify({
    connectHash: user.id + "." + user.password
  })

  req.author.send(`${url}`)
  res.reply("Welcome to the new `fit` bot! I've DM'd you instructions on how to connect your account");
}


/**
 * Displays an overview of stats including averages and current level
 */
export async function profile(req: Request, res: Response) {
  const message = await res.reply("*Fetching data*");
  // const data = await strava.getProfileData(req.author.id);

  // console.log("USER", profile);
  const embed = new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("strava user");

  message.delete();
  req.channel.send(embed);
}