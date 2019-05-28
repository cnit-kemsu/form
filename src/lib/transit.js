import { Transistor, cache } from './Transistor';

function findTransistor(composer, name) {
  let transistor = cache.find(
    ([_composer, _name]) => _composer === composer && _name === name
  )?.transistor;

  if (transistor) return transistor;

  transistor = new Transistor(composer, name);
  cache.push([
    composer,
    name,
    transistor
  ]);
  return transistor;
}

export function transit(composer, name) {
  const path = name.split('.');
  if (path.length === 1) return [composer, path[0]];

  const lastIndex = path.length - 1;
  let transistor = findTransistor(composer, path[0]);
  if (path.length > 2) for (let index = 1; index < lastIndex; index++) {
    transistor = findTransistor(transistor, path[index]);
  }
  return [transistor, path[lastIndex]];
}