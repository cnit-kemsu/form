import { Transistor } from './Transistor';

export function transit(_this, composer, name) {
  const path = name.split('.');
  if (path.length === 1) {
    _this.composer = composer;
    _this.name = path[0];
  } else {
    let transistor = new Transistor(composer, path[0]);
    if (path.length > 2) for (let index = 1; index < path.length - 1; index++) {
      transistor = new Transistor(transistor, path[index]);
    }
    _this.composer = transistor;
    _this.name = path[path.length - 1];
  }
}