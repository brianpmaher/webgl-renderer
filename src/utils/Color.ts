export default class Color {
  public static readonly BLACK = new Color(0.0, 0.0, 0.0, 1.0);

  private _values: Float32Array;

  constructor(r: number = 0.0, g: number = 0.0, b: number = 0.0, a: number = 0.0) {
    this._values = new Float32Array(4);
    this.set(r, g, b, a);
  }

  set(r: number, g: number, b: number, a: number): void {
    const { _values: values } = this;
    values[0] = r;
    values[1] = g;
    values[2] = b;
    values[3] = a;
  }
}
