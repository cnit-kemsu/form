function copyObject(target, customCopy) {
  const newObject = {};
  for (const key in target) newObject[key] = copy(target[key], customCopy);
  return newObject;
}

function simpleCopy(value) {
  return value;
}

export function copy(target, customCopy = simpleCopy) {
  const copyElement = value => copy(value, customCopy);
  if (target instanceof Array) return target.map(copyElement);
  if (target instanceof Object && target.constructor === Object) return copyObject(target, customCopy);
  return customCopy(target);
}

