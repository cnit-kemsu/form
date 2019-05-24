import { Composite } from './Composite';

export function compose(_this, composer, name) {
  const path = name.split('.');
  if (path.length === 1) {
    _this.composer = composer;
    _this.name = path[0];
  } else {
    let composite = new Composite(composer, path[0]);
    if (path.length > 2) for (let index = 1; index < path.length - 1; index++) {
      composite = new Composite(composite, path[index]);
    }
    _this.composer = composite;
    _this.name = path[path.length - 1];
  }
}