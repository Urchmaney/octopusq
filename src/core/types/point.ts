export class Point {
  public static addPoints(first: Point, second: Point): Point {
    return new Point(first.x + second.x, first.y + second.y);
  }

  public static zero = new Point();

  public x = 0;
  public y = 0;
  
  constructor(x?: number, y?: number) {
    if(x) this.x = x;
    if(y) this.y = y;
  }

  public addX(by: number) {
    this.x += by;
  }

  public addY(by: number) {
    this.y += by;
  }

  public add(point: Point) {
    this.x += point.x;
    this.y += point.y;
  }
} 