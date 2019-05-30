import { useMemo, useEffect, useContext } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { Composite } from '@lib/Composite';
import { FieldContext } from '@components/Fields';

export function useComposite(composer, name, validate) {

  const _composer = composer || useContext(FieldContext);
  const forceUpdate = useForceUpdate();
  const composite = useMemo(() => new Composite(forceUpdate, _composer, name, validate), []);

  useEffect(composite.handleSubscriptions, []);

  return [
    composite,
    {
      error: composite.error,
      dirty: composite.dirty,
      touched: composite.touched,
      onBlur: composite.handleBlur
    }
  ];
}
