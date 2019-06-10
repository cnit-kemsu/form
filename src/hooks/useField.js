import { useMemo, useEffect, useContext } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { Field } from '../lib/Field';
import { ComposerContext } from '../components/Fields';

function defaultValueGetter(event) {
  return event.currentTarget.value;
}

export function useField(composer, name, validate, getValue = defaultValueGetter, deserialize) {

  const _composer = composer || useContext(ComposerContext);
  const forceUpdate = useForceUpdate();
  const field = useMemo(() => new Field(forceUpdate, _composer, name, validate, getValue, deserialize), []);

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