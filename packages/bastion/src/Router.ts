import * as Discord from "discord.js";
import Response from "./Response";
import Debug from "debug";

const debug = Debug("bastion");

export default class Router {
  private routes = new Map<string, Middleware[]>();

  use = (route: string, ...mw: Middleware[]) => {
    this.routes.set(route, mw);
  }

  handle(route: string, req: Discord.Message, res: Response) {
    const middlewares = this.routes.get(route);

    // If no route, exit out
    if (!middlewares) {
      debug("route missing: %o", route);
      return;
    }

    const exec = (idx: number) => {
      if (!middlewares[idx]) return;
      middlewares[idx](req, res, () => exec(idx + 1));
    }

    exec(0)
  }
}

export type Request = Discord.Message;
export type Middleware = (request: Discord.Message, response: Response, next: ()=>void)=>void;