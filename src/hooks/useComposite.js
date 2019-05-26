import { useMemo, useEffect } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { Composite } from '@lib/Composite';

export function useComposite(composer, name, validate) {

  const forceUpdate = useForceUpdate();
  const composite = useMemo(() => new Composite(forceUpdate, composer, name, validate), []);

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
