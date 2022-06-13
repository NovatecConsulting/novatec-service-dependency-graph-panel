import _ from 'lodash';
import { Point, Rectangle } from 'types';

export default class CollisionDetector {
  blockedArea: Rectangle[];

  constructor() {
    this.blockedArea = [];
  }

  reset() {
    this.blockedArea = [];
  }

  addRectangle(x: number, y: number, width: number, height: number) {
    const rectangle: Rectangle = {
      coordinates: {
        x: x,
        y: y,
      },
      height: height,
      width: width,
    };
    this.blockedArea.push(rectangle);
  }

  isColliding(shape: Rectangle) {
    const collidingShape = this.blockedArea.find((blockingShape) => {
      if (this._intersects(shape, blockingShape)) {
        return true;
      }
      return false;
    });
    return collidingShape !== undefined;
  }

  _intersects(a: Rectangle, b: Rectangle) {
    const topLeft1: Point = a.coordinates;
    const topLeft2: Point = b.coordinates;
    const bottomRight1 = this._getBottomRightCorner(a);
    const bottomRight2 = this._getBottomRightCorner(b);

    if (topLeft1.x > bottomRight2.x || topLeft2.x > bottomRight1.x) {
      return false;
    }
    if (topLeft1.y > bottomRight2.y || topLeft2.y > bottomRight1.y) {
      return false;
    }
    return true;
  }

  _getBottomRightCorner(rectangle: Rectangle) {
    const cornerPoint: Point = {
      x: rectangle.coordinates.x + rectangle.width,
      y: rectangle.coordinates.y + rectangle.height,
    };
    return cornerPoint;
  }
}
