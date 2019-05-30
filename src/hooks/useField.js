import { useMemo, useEffect, useContext } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { Field } from '@lib/Field';
import { FieldContext } from '@components/Fields';

function defaultValueGetter(event) {
  return event.currentTarget.value;
}

export function useField(composer, name, validate, getValue = defaultValueGetter) {

  const _composer = composer || useContext(FieldContext);
  const forceUpdate = useForceUpdate();
  const field = useMemo(() => new Field(forceUpdate, _composer, name, validate, getValue), []);

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