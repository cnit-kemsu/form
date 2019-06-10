function copyObject(target) {
  const newObject = {};
  for (const key in target) newObject[key] = copy(target[key]);
  return newObject;
}

function simpleCopy(value) {
  return value;
}

export function copy(target, customFn = simpleCopy) {
  if (target instanceof Array) return target.map(copy);
  if (target.constructor === Object) return copyObject(target);
  return customFn(target);
}

