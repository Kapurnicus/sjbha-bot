import config from "../config";

export default class ExperiencePoints {
  constructor(
    private activeSeconds: number,
    private hardSeconds: number
  ) {}

  get active() {
    return this.activeSeconds * config.exp_multi;
  }

  get hard() {
    return this.hardSeconds * config.exp_multi * config.hard_multi;
  }  

  get total() {
    return this.active + this.hard;
  }
}