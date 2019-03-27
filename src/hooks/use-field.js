import { useMemo, useEffect } from 'react';
import { useForceUpdate } from './use-force-update';
import { Field } from '../classes/field';

function defaultValueGetter(event) {
  return event.currentTarget.value;
}

export function useField(composer, name, validate, getValue = defaultValueGetter) {

  const forceUpdate = useForceUpdate();
  const field = useMemo(() => new Field(forceUpdate, composer, name, validate, getValue), []);

  useEffect(field.handleSubscriptions, []);
  
  return {
    name: field.name,
    value: field.value,
    error: field.error,
    dirty: field.dirty,
    touched: field.touched,
    onChange: field.handleChange,
    onBlur: field.handleBlur
  };
}