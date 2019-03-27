import { useReducer } from 'react';

function reducer(value) {
  return !value;
}

export function useForceUpdate() {
  return useReducer(reducer, false)[1];
}