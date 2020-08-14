export default class Profile {
  constructor(
    private _xp: number = 0
  ) {}

  get xp() { return this._xp }

  public json = () => ({
    xp: this._xp
  })
}