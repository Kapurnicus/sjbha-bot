import {Request, Response} from "@bored/bastion";

/** Replies with pong, used to check if the bot is alive and kickin' */
const ping = (req: Request, res: Response) => {
  res.reply("pong!");
}

export default ping;