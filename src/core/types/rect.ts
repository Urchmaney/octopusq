import { Point } from "./point";

export class Rect {
  private readonly position: Point;

  public constructor(x: number, y: number, public width: number, public height: number) {
    this.position= new Point(x, y);
  }

  public get left() {
    return this.position.x;
  }

  public get right() {
    return this.position.x + this.width;
  }

  public get top() {
    return this.position.y;
  }

  public get bottom() {
    return this.position.y + this.height;
  }

  public addX(by: number) {
    this.position.addX(by);
  }

  public addY(by: number) {
    this.position.addY(by)
  }

  public includes(point: Point, adjustX?: number, adjustY?: number): boolean {
    return (
      point.x >= this.position.x - (adjustX || 0) &&
      point.x <= this.position.x + this.width + (adjustX || 0) &&
      point.y >= this.position.y - (adjustY || 0) &&
      point.y <= this.position.y + this.height + (adjustY || 0)
    );
  }

  public intersect(other: Rect): boolean {
    return (
      this.left < other.right &&
      this.right > other.left &&
      this.top < other.bottom &&
      this.bottom > other.top
    );
  }

  public translate(vector: Point): Rect {
    const translation = vector;
    return new Rect(
      this.position.x + translation.x,
      this.position.y + translation.y,
      this.width,
      this.height,
    );
  }

  public scalePointFrom(point: Point, from: Rect): Point {
    return new Point((point.x * this.width) / from.width, (point.y * this.height) / from.height)
  }
}