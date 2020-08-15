import ActivityEffort from "./ActivityEffort"
import config from "../config";
import Debug from "debug";
import ExperiencePoints from "./ExperiencePoints";

const debug = Debug("c/fit:profile");

export default class Profile {
  constructor(
    private _exp: number = 0
  ) {}

  get exp() { return this._exp }
  get level() { return 1; }

  public addEffort(effort: ActivityEffort) {
    const exp = new ExperiencePoints(effort.active, effort.hard);
    this._exp += exp.total;

    debug("Gained %o experience points (%o+ %o++)", exp.total, exp.active, exp.hard);
    return exp;
  }

  public json = () => ({
    exp: this._exp
  })
}