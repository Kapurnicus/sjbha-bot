import * as Discord from "discord.js";

export default class Response {
  private message: Discord.Message;
  private client: Discord.Client;

  constructor(client: Discord.Client, message: Discord.Message) {
    this.message = message;
    this.client = client;
  }

  /** Reply directly to the incoming message */
  reply = (msg: string) => this.message.channel.send(msg);
}