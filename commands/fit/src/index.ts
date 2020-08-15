// Set configuration variables
export {setConfig as config} from "./config";


// Bot code
import * as bastion from "@bored/bastion";
import {routeParam} from "@bored/bastion-toolkit";
import * as bot from "./controllers/bot";

const botRouter = new bastion.Router()

botRouter.use("help", bot.help);
botRouter.use("auth", bot.auth);
botRouter.use("profile", bot.profile);

export const command = routeParam(botRouter, {default: "help"});


// Web controllers
import * as express from "express";
import * as web from "./controllers/web";

const router = express.Router();

router.get("/connect", web.authConnect);
router.get("/accept", web.authAccept);

router.get("/webhook", web.verifyHook);
router.post("/webhook", web.postActivity);

export {router};