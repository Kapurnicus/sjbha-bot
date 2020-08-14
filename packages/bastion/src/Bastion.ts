import * as Discord from "discord.js";
import Router, {Middleware} from "./Router";
import Response from "./Response";
import Debug from "debug";

const debug = Debug("bastion");

export default class Bastion extends Router {
  /** Reference to the `discord.js` library client */
  private client = new Discord.Client();
  /** Discord API token */
  private token: string;
  /** The character used to initiate a command */
  public instigator: string;
  
  constructor(opt: BastionOptions) {
    super()

    this.token = opt.token;
    this.instigator = opt.instigator;
  }

  /** Event handler for when a message comes in */
  private onMessage = (msg: Discord.Message) => {
    // ignore self
    if (msg.author.bot) return;

    const [command] = msg.content.split(" ");
    if (!command.startsWith(this.instigator)) return;

    debug(`%o`, msg.content);

    const route = command.substr(
      this.instigator.length,
      command.length
    )

    const res = new Response(this.client, msg);
    this.handle(route, msg, res)
  }

  /** Connects the bot to the server */
  public start = (onConnect=(client: Discord.Client)=>{}) => {
    this.client.on("ready", () => onConnect(this.client));
    this.client.on('message', this.onMessage);
    this.client.login(this.token)
  }
}

interface BastionOptions {
  token: string;
  instigator: string;
}