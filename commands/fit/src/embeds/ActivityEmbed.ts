import {MessageEmbed} from "discord.js";

export default class ActivityEmbed {
  constructor() {}

  public getEmbed() {
    return new MessageEmbed()
      .setTitle("Hello World!")
  }

  public static create() {
    return new ActivityEmbed();
  }
}