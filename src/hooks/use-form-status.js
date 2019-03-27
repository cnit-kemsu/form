import { useMemo, useEffect } from 'react';
import { useForceUpdate } from './use-force-update';
import { FormStatus } from '../classes/form-status';

export function useFormStatus(composer) {

  const forceUpdate = useForceUpdate();
  const formStatus = useMemo(() => new FormStatus(forceUpdate, composer), []);

  useEffect(formStatus.handleSubscriptions, []);
  
  return {
    hasErrors: formStatus.hasErrors,
    dirty: formStatus.dirty,
    touched: formStatus.touched,
    submitErrors: formStatus.submitErrors
  };
}