import { useMemo, useEffect } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { FieldArray } from '../classes/FieldArray';

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