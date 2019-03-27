import { useMemo, useEffect } from 'react';
import { useForceUpdate } from './use-force-update';
import { Compound } from '../classes/compound';

export function useCompound(composer, name, validate) {

  const forceUpdate = useForceUpdate();
  const compound = useMemo(() => new Compound(forceUpdate, composer, name, validate), []);

  useEffect(compound.handleSubscriptions, []);

  return [
    compound,
    {
      error: compound.error,
      dirty: compound.dirty,
      touched: compound.touched,
      onBlur: compound.handleBlur
    }
  ];
}
