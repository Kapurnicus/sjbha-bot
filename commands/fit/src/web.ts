import * as express from "express";
import Debug from "debug";
import { NotConnected } from "./errors";

import AuthService from "./services/Authorization";
import ProfileService from "./services/Profile";

const debug = Debug("c/fit:auth-web");
const auth = new AuthService();
const profile = new ProfileService()

/**
 * Begins the Authorization Grant oauth flow by redirecting to the strava authorization page
 * 
 * @query `connectHash` The 'username.password' string hash
 */
export async function authConnect(req: express.Request, res: express.Response) {
  debug("GET /connect")

  const connectHash = <string>req.query.connectHash;

  if (!connectHash) {
    debug("Missing connectHash");
    return res.status(401).send(`Unable to validate`);
  }

  const [discordId, password] = connectHash.split(".");

  try {
    const url = await auth.getAuthorizationUrl(discordId, password);
    res.redirect(url);
  } catch (e) {
    debug("Unable to connect user to strava auth. Error: %o", e);
    // todo: make this a page
    res.status(401).send(`There is a problem with the URL, please try to use !strava auth again`);
  }
}


/** 
 * Redirect landing from authorization grant flow
 * 
 * @query `code`
 * @query `state`
 */
export async function authAccept(req: express.Request, res: express.Response) {
  debug("GET /accept")

  const code = <string>req.query.code;
  const connectHash = <string>req.query.state;
  if (!code || !connectHash) return res.send("Invalid token");

  const [discordId, password] = connectHash.split(".");

  try {
    await auth.acceptStravaCode(discordId, password, code);
    res.send("You are now connected to the strava bot!")
  } catch (e) {
    switch (e.name) {
    case NotConnected.type: return res.send(`Something went wrong when trying to authorize your acount. Try using !strava auth once again`)

    default:
      debug("Token acceptance failed");
      console.error(e);

      return res.send("Something unexpected went wrong and your account couldn't be connected");

    }
  }
}


/**
 * In order to sign up for a webhook for strava, you need to accept the "hub challenge"
 * by echo-ing back the random string they pass in.
 * 
 * @see https://developers.strava.com/docs/webhooks/
 * @query `hub.challenge`
 */
export async function verifyHook(req: express.Request, res: express.Response) {
  const challenge = <string>req.query["hub.challenge"];
  res.send({"hub.challenge": challenge});
}


/** 
 * When an athlete posts an activity, this webhook is called with the owner ID and activity ID.
 * We need to add it to the profile data, and then send the embed to the channel
 * 
 * @body `owner_id` The athlete ID
 * @body `object_id` The activity ID
 * @body `aspect_type` Whether the event is a "create", or (something else)
 */
export async function postActivity(req: express.Request, res: express.Response) {
  debug("POST /webhook");

  const stravaId = String(req.body["owner_id"]);
  const activityId = String(req.body["object_id"]);
  const eventType = <string>req.body["aspect_type"];

  try {
    // todo: make sure to only post on creation
    // if (eventType === "create")
    await profile.addActivity(stravaId, activityId);

    // todo: implementation
    // something.
    
    res.status(200).send("Posted");
  } catch (e) {
    if (e.name === NotConnected.type) {
      debug("Could not post activity: %o", e.message);
      res.status(401).send("Hasn't been authorized ")
    } else {
      console.error(e);
      res.status(500).send("Messed something up")
    }
  }
}