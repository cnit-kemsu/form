import { useMemo, useEffect } from 'react';
import { useForceUpdate } from './use-force-update';
import { FieldArray } from '../classes/field-array';

export function useFieldArray(composer, name, validate) {

  const forceUpdate = useForceUpdate();
  const fieldArray = useMemo(() => new FieldArray(forceUpdate, composer, name, validate), []);

  useEffect(fieldArray.handleSubscriptions, []);

  return [
    {
      map: fieldArray.map,
      push: fieldArray.push
    },
    {
      error: fieldArray.error,
      dirty: fieldArray.dirty,
      touched: fieldArray.touched,
      onBlur: fieldArray.handleBlur
    }
  ];
}
